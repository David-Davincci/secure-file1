const crypto = require('crypto');

/**
 * Encrypts a file buffer using AES-256-GCM.
 * Generates a new random key and IV for each encryption.
 * 
 * @param {Buffer} fileBuffer - The file content to encrypt
 * @returns {Object} - { encryptedFile: Buffer, rawKey: Buffer }
 *                     encryptedFile format: [IV(16)][AuthTag(16)][EncryptedData]
 */
function encryptFile(fileBuffer) {
    // Generate random key (32 bytes for AES-256) and IV (12 bytes for GCM standard, or 16? GCM usually uses 12 bytes (96 bits) for IV)
    // NIST recommends 12 bytes (96 bits) for GCM IV.
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const encrypted = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    // Pack: IV (12) + AuthTag (16) + EncryptedData
    const encryptedFile = Buffer.concat([
        iv,
        authTag,
        encrypted
    ]);

    return {
        encryptedFile,
        rawKey: key
    };
}

module.exports = { encryptFile };
