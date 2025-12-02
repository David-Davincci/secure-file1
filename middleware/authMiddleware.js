const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../lib/supabase/client');

const protect = async (req, res, next) => {
    try {
        let token;

        // 1) Getting token from cookies
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({
                error: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verification token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        // We use supabaseAdmin to bypass RLS and direct DB access
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', decoded.id)
            .single();

        if (error || !user) {
            return res.status(401).json({
                error: 'The user belonging to this token does no longer exist.'
            });
        }

        // 4) Check if user is verified
        if (!user.is_verified) {
            return res.status(403).json({
                error: 'Please verify your email address before accessing this resource.'
            });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token or session expired' });
    }
};

module.exports = { protect };
