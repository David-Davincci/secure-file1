require('dotenv').config();
console.log('Environment loaded.');
console.log('PORT:', process.env.PORT);
console.log('RSA_PRIVATE_KEY length:', process.env.RSA_PRIVATE_KEY ? process.env.RSA_PRIVATE_KEY.length : 'MISSING');
