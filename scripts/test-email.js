const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log('📧 Testing Email Configuration...\n');

    // Check if email credentials are configured
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
        console.log('❌ Email not configured yet!');
        console.log('   Please update SMTP_USER and SMTP_PASS in your .env file\n');
        console.log('📋 Current configuration:');
        console.log(`   SMTP_HOST: ${process.env.SMTP_HOST}`);
        console.log(`   SMTP_PORT: ${process.env.SMTP_PORT}`);
        console.log(`   SMTP_USER: ${process.env.SMTP_USER}`);
        console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? '***configured***' : 'NOT SET'}`);
        return;
    }

    console.log('📋 Email Configuration:');
    console.log(`   Host: ${process.env.SMTP_HOST}`);
    console.log(`   Port: ${process.env.SMTP_PORT}`);
    console.log(`   User: ${process.env.SMTP_USER}`);
    console.log(`   Pass: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.substring(0, 4) + '***' : 'NOT SET'}`);
    console.log('');

    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        console.log('🔌 Testing SMTP connection...');

        // Verify connection
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');

        // Send test email
        console.log('📨 Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `Secure Cloud <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to yourself for testing
            subject: '✅ Secure Cloud - Email Test Successful',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🎉 Email Configuration Successful!</h2>
          <p>Your Secure Cloud email service is working correctly.</p>
          <p>This test email confirms that:</p>
          <ul>
            <li>✅ SMTP connection is established</li>
            <li>✅ Authentication is successful</li>
            <li>✅ Emails can be sent</li>
          </ul>
          <p>You can now use email verification and password reset features!</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 0.9rem;">
            Sent from Secure Cloud at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
            text: 'Email configuration test successful! Your Secure Cloud email service is working.'
        });

        console.log('✅ Test email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Sent to: ${process.env.SMTP_USER}\n`);
        console.log('📬 Check your inbox to confirm delivery!\n');

    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        console.log('\n💡 Troubleshooting tips:');
        console.log('   1. Make sure you\'re using a Gmail App Password (not your regular password)');
        console.log('   2. Enable 2-Step Verification on your Google account');
        console.log('   3. Generate App Password: https://myaccount.google.com/apppasswords');
        console.log('   4. Check that SMTP_USER and SMTP_PASS are correct in .env\n');
    }
}

testEmail();
