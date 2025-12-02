const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env');
const examplePath = path.join(__dirname, '..', '.env.example');

console.log('🔧 Setting up environment...');

// 1. Copy .env.example if .env doesn't exist
if (!fs.existsSync(envPath)) {
    console.log('📄 Creating .env from .env.example...');
    fs.copyFileSync(examplePath, envPath);
} else {
    console.log('📄 .env already exists.');
}

// 2. Read .env
let envContent = fs.readFileSync(envPath, 'utf8');

// 3. Generate Keys if placeholders exist
if (envContent.includes('-----BEGIN PRIVATE KEY-----')) {
    console.log('🔑 Generating new RSA Key Pair...');

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // Escape newlines for .env format if needed, but usually we can just quote them
    // However, dotenv handles multiline strings if quoted. 
    // Let's flatten them to single line with \n for safety in .env parsers that might be strict
    const privKeyStr = privateKey.replace(/\n/g, '\\n');
    const pubKeyStr = publicKey.replace(/\n/g, '\\n');

    envContent = envContent.replace(
        /RSA_PRIVATE_KEY="[^"]*"/,
        `RSA_PRIVATE_KEY="${privKeyStr}"`
    );

    envContent = envContent.replace(
        /RSA_PUBLIC_KEY="[^"]*"/,
        `RSA_PUBLIC_KEY="${pubKeyStr}"`
    );

    fs.writeFileSync(envPath, envContent);
    console.log('✅ RSA Keys injected into .env');
} else {
    console.log('ℹ️ RSA keys appear to be already set.');
}

console.log('\n⚠️  NOTE: You still need to manually add your SUPABASE_URL, KEYS, and SMTP settings in .env!');
