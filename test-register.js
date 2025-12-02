const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testRegister() {
    try {
        console.log('🧪 Testing registration endpoint...\n');
        
        const testEmail = `test-${Date.now()}@gmail.com`;
        const testPassword = 'testPassword123';
        
        console.log('📧 Test Email:', testEmail);
        console.log('🔐 Test Password:', testPassword);
        console.log('\nSending request to /api/auth/register...\n');
        
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            email: testEmail,
            password: testPassword
        });
        
        console.log('✅ Success:', response.status);
        console.log('Response:', response.data);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.status);
        console.error('Error Details:', error.response?.data || error.message);
        console.error('Full Error:', error);
    }
}

testRegister();
