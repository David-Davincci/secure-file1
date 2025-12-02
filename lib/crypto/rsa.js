const crypto = require('crypto');

/**
 * Encrypts (wraps) a data buffer (e.g., AES key) using the RSA public key.
 * Uses RSA-OAEP with SHA-256.
 * 
 * @param {Buffer} data - The data to encrypt (e.g., the AES key)
 * @param {string} publicKeyPem - The RSA public key in PEM format
 * @returns {string} - The encrypted data in base64 format
 */
function encryptWithRSA(data, publicKeyPem) {
    try {
        const encrypted = crypto.publicEncrypt(
            {
                key: publicKeyPem,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            data
        );
        return encrypted.toString('base64');
    } catch (error) {
        console.error('RSA Encryption Error:', error);
        throw new Error('Failed to encrypt key with RSA');
    }
}

/**
 * Decrypts (unwraps) an encrypted data buffer using the RSA private key.
 * Uses RSA-OAEP with SHA-256.
 * 
 * @param {string} encryptedData - The encrypted data in base64 format
 * @param {string} privateKeyPem - The RSA private key in PEM format
 * @returns {Buffer} - The decrypted data (e.g., the AES key)
 */
function decryptWithRSA(encryptedData, privateKeyPem) {
    try {
        const buffer = Buffer.from(encryptedData, 'base64');
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKeyPem,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            buffer
        );
        return decrypted;
    } catch (error) {
        console.error('RSA Decryption Error:', error);
        throw new Error('Failed to decrypt key with RSA');
    }
}

module.exports = {
    encryptWithRSA,
    decryptWithRSA
};
