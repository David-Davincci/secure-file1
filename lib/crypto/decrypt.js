const crypto = require('crypto');

/**
 * Decrypts a file buffer using AES-256-GCM.
 * Expects the input buffer to be packed as [IV(12)][AuthTag(16)][EncryptedData].
 * 
 * @param {Buffer} packedBuffer - The encrypted file content
 * @param {Buffer} key - The raw AES-256 key
 * @returns {Buffer} - The decrypted file content
 */
function decryptFile(packedBuffer, key) {
    // Extract IV, AuthTag, and Encrypted Content
    const ivLength = 12;
    const tagLength = 16;

    if (packedBuffer.length < ivLength + tagLength) {
        throw new Error('Invalid encrypted file format: too short');
    }

    const iv = packedBuffer.subarray(0, ivLength);
    const authTag = packedBuffer.subarray(ivLength, ivLength + tagLength);
    const encryptedContent = packedBuffer.subarray(ivLength + tagLength);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encryptedContent),
        decipher.final()
    ]);

    return decrypted;
}

module.exports = { decryptFile };
