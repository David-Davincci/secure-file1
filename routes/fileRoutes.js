const express = require('express');
const multer = require('multer');
const { supabaseAdmin } = require('../lib/supabase/client');
const { protect } = require('../middleware/authMiddleware');
const { encryptFile } = require('../lib/crypto/encrypt');
const { decryptFile } = require('../lib/crypto/decrypt');
const { encryptWithRSA, decryptWithRSA } = require('../lib/crypto/rsa');

const router = express.Router();

// Configure Multer for memory storage (max 50MB)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// UPLOAD FILE
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const userId = req.user.id;

        // 1. Encrypt file content (AES)
        // Returns { encryptedFile, rawKey }
        const { encryptedFile, rawKey } = encryptFile(file.buffer);

        // 2. Encrypt AES key (RSA)
        const rsaPublicKey = process.env.RSA_PUBLIC_KEY;
        if (!rsaPublicKey) {
            throw new Error('Server configuration error: Missing RSA Public Key');
        }
        const encryptedAesKey = encryptWithRSA(rawKey, rsaPublicKey);

        // 3. Upload to Supabase Storage
        const storagePath = `${userId}/${Date.now()}_${file.originalname}`;
        const { error: storageError } = await supabaseAdmin
            .storage
            .from(process.env.SUPABASE_STORAGE_BUCKET)
            .upload(storagePath, encryptedFile, {
                contentType: 'application/octet-stream',
                upsert: false
            });

        if (storageError) {
            console.error('Storage upload error:', storageError);
            throw new Error('Failed to upload file to storage');
        }

        // 4. Save metadata to Database
        const { data: fileData, error: dbError } = await supabaseAdmin
            .from('files')
            .insert({
                user_id: userId,
                file_name: file.originalname,
                mime_type: file.mimetype,
                size: file.size,
                storage_path: storagePath,
                encrypted_aes_key: encryptedAesKey
            })
            .select()
            .single();

        if (dbError) {
            // Cleanup storage if DB fails
            await supabaseAdmin.storage.from(process.env.SUPABASE_STORAGE_BUCKET).remove([storagePath]);
            throw dbError;
        }

        res.status(201).json({
            status: 'success',
            data: { file: fileData }
        });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message || 'File upload failed' });
    }
});

// LIST FILES
router.get('/list', protect, async (req, res) => {
    try {
        const { data: files, error } = await supabaseAdmin
            .from('files')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            results: files.length,
            data: { files }
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve files' });
    }
});

// HELPER: Download and Decrypt
async function getDecryptedFile(fileId, userId) {
    // 1. Get metadata
    const { data: fileRecord, error: dbError } = await supabaseAdmin
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single();

    if (dbError || !fileRecord) {
        throw new Error('File not found or access denied');
    }

    // 2. Download from Storage
    const { data: fileBlob, error: storageError } = await supabaseAdmin
        .storage
        .from(process.env.SUPABASE_STORAGE_BUCKET)
        .download(fileRecord.storage_path);

    if (storageError) {
        throw new Error('Failed to retrieve file from storage');
    }

    // Convert Blob to Buffer
    const arrayBuffer = await fileBlob.arrayBuffer();
    const encryptedBuffer = Buffer.from(arrayBuffer);

    // 3. Decrypt AES Key (RSA)
    const rsaPrivateKey = process.env.RSA_PRIVATE_KEY;
    if (!rsaPrivateKey) {
        throw new Error('Server configuration error: Missing RSA Private Key');
    }
    const rawKey = decryptWithRSA(fileRecord.encrypted_aes_key, rsaPrivateKey);

    // 4. Decrypt Content (AES)
    const decryptedBuffer = decryptFile(encryptedBuffer, rawKey);

    return {
        buffer: decryptedBuffer,
        mimeType: fileRecord.mime_type,
        fileName: fileRecord.file_name
    };
}

// PREVIEW FILE
router.get('/preview/:id', protect, async (req, res) => {
    try {
        const { buffer, mimeType } = await getDecryptedFile(req.params.id, req.user.id);

        res.setHeader('Content-Type', mimeType);
        res.send(buffer);

    } catch (err) {
        console.error('Preview error:', err);
        res.status(404).json({ error: err.message });
    }
});

// DOWNLOAD FILE
router.get('/download/:id', protect, async (req, res) => {
    try {
        const { buffer, mimeType, fileName } = await getDecryptedFile(req.params.id, req.user.id);

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(buffer);

    } catch (err) {
        console.error('Download error:', err);
        res.status(404).json({ error: err.message });
    }
});

// DELETE FILE
router.delete('/delete/:id', protect, async (req, res) => {
    try {
        const { data: fileRecord, error: dbFetchError } = await supabaseAdmin
            .from('files')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (dbFetchError || !fileRecord) {
            return res.status(404).json({ error: 'File not found' });
        }

        // 1. Remove from Storage
        const { error: storageError } = await supabaseAdmin
            .storage
            .from(process.env.SUPABASE_STORAGE_BUCKET)
            .remove([fileRecord.storage_path]);

        if (storageError) {
            console.warn('Storage delete warning:', storageError);
            // Continue to delete from DB even if storage fails (orphan cleanup later)
        }

        // 2. Remove from DB
        const { error: dbDeleteError } = await supabaseAdmin
            .from('files')
            .delete()
            .eq('id', req.params.id);

        if (dbDeleteError) throw dbDeleteError;

        res.status(200).json({ status: 'success', message: 'File deleted' });

    } catch (err) {
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

module.exports = router;
