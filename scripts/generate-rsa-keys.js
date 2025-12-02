const crypto = require('crypto');

console.log('Generating RSA-2048 Key Pair...');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

console.log('\nCopy the following into your .env file:\n');
console.log('RSA_PUBLIC_KEY="' + publicKey.replace(/\n/g, '\\n') + '"');
console.log('\nRSA_PRIVATE_KEY="' + privateKey.replace(/\n/g, '\\n') + '"');

console.log('\n⚠️  IMPORTANT: Keep the private key secret! Do not commit it to version control.');
