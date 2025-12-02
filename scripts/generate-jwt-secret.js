const crypto = require('crypto');

// Generate a secure random JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('🔑 Generated JWT Secret:\n');
console.log(jwtSecret);
console.log('\nCopy this into your .env file for JWT_SECRET');
