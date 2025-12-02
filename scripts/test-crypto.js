const { encryptFile } = require('../lib/crypto/encrypt');
const { decryptFile } = require('../lib/crypto/decrypt');
const { encryptWithRSA, decryptWithRSA } = require('../lib/crypto/rsa');
const crypto = require('crypto');

console.log('🧪 Starting Crypto Verification Test...\n');

try {
    // 1. Generate temporary RSA keys for testing
    console.log('1. Generating RSA Key Pair...');
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    console.log('✅ RSA Keys Generated');

    // 2. Create dummy file content
    const originalContent = 'This is a secret message that needs to be encrypted! 🔒';
    const fileBuffer = Buffer.from(originalContent);
    console.log(`\n2. Original Content: "${originalContent}"`);

    // 3. Encrypt File (AES)
    console.log('\n3. Encrypting File (AES-256-GCM)...');
    const { encryptedFile, rawKey } = encryptFile(fileBuffer);
    console.log(`✅ File Encrypted. Size: ${encryptedFile.length} bytes`);
    console.log(`   AES Key: ${rawKey.toString('hex').substring(0, 16)}...`);

    // 4. Encrypt Key (RSA)
    console.log('\n4. Wrapping AES Key (RSA-OAEP)...');
    const wrappedKey = encryptWithRSA(rawKey, publicKey);
    console.log(`✅ Key Wrapped. Length: ${wrappedKey.length}`);

    // --- SIMULATE STORAGE/RETRIEVAL ---

    // 5. Decrypt Key (RSA)
    console.log('\n5. Unwrapping AES Key (RSA-OAEP)...');
    const unwrappedKey = decryptWithRSA(wrappedKey, privateKey);

    if (unwrappedKey.equals(rawKey)) {
        console.log('✅ Key Unwrap Successful: Keys Match');
    } else {
        throw new Error('❌ Key Unwrap Failed: Keys do not match');
    }

    // 6. Decrypt File (AES)
    console.log('\n6. Decrypting File (AES-256-GCM)...');
    const decryptedBuffer = decryptFile(encryptedFile, unwrappedKey);
    const decryptedContent = decryptedBuffer.toString();

    console.log(`   Decrypted Content: "${decryptedContent}"`);

    if (decryptedContent === originalContent) {
        console.log('\n✨ SUCCESS: Decrypted content matches original!');
    } else {
        throw new Error('❌ Content Mismatch');
    }

} catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    process.exit(1);
}
