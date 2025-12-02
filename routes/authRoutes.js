const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { supabaseAdmin } = require('../lib/supabase/client');
const { createSendToken } = require('../lib/auth/jwt');
const { protect } = require('../middleware/authMiddleware');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../lib/email/mailer');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        // Check if user exists
        let existingUser = null;
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('email', email)
                .single();
            
            if (error && error.code === 'PGRST116') {
                // No matching records found - that's fine for registration
                existingUser = null;
            } else if (error) {
                throw error;
            } else {
                existingUser = data;
            }
        } catch (err) {
            console.error('Database query error:', err.message);
            if (err.message && (err.message.includes('is_verified') || err.message.includes('schema cache'))) {
                return res.status(503).json({ 
                    error: 'Database temporarily unavailable. This is a known issue - please try again in a moment.' 
                });
            }
            throw err;
        }

        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const { data: newUser, error } = await supabaseAdmin
            .from('users')
            .insert({
                email,
                password_hash: passwordHash,
                verification_token: verificationToken,
                is_verified: false
            })
            .select()
            .single();

        if (error) throw error;

        // Send email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (err) {
            console.error('Email send error:', err);
            // Don't fail registration if email fails, but warn user
            return res.status(201).json({
                status: 'success',
                message: 'Account created, but failed to send verification email. Please contact support.'
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Account created! Please check your email to verify your account.'
        });

    } catch (err) {
        console.error('❌ Registration Error:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// VERIFY EMAIL
router.get('/verify', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('verification_token', token)
            .single();

        if (error || !user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Update user
        await supabaseAdmin
            .from('users')
            .update({
                is_verified: true,
                verification_token: null
            })
            .eq('id', user.id);

        // Redirect to login with success message (or return JSON if handled by frontend JS)
        // Since this is an API route, we'll return JSON, but frontend verify page will call this
        res.status(200).json({
            status: 'success',
            message: 'Email verified successfully! You can now log in.'
        });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        // Get user
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check verification
        if (!user.is_verified) {
            return res.status(403).json({ error: 'Please verify your email first' });
        }

        createSendToken(user, 200, res);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (!user) {
            // Don't reveal user existence
            return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await supabaseAdmin
            .from('users')
            .update({
                reset_token: resetToken,
                reset_token_expires: expires.toISOString()
            })
            .eq('id', user.id);

        try {
            await sendPasswordResetEmail(email, resetToken);
        } catch (err) {
            return res.status(500).json({ error: 'Error sending email' });
        }

        res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, reset_token_expires')
            .eq('reset_token', token)
            .single();

        if (error || !user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        if (new Date(user.reset_token_expires) < new Date()) {
            return res.status(400).json({ error: 'Token expired' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await supabaseAdmin
            .from('users')
            .update({
                password_hash: passwordHash,
                reset_token: null,
                reset_token_expires: null
            })
            .eq('id', user.id);

        res.status(200).json({ status: 'success', message: 'Password reset successfully' });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// LOGOUT
router.post('/logout', (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
});

// GET CURRENT USER
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { user: req.user }
    });
});

module.exports = router;
