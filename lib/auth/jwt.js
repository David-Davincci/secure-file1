const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send on HTTPS in production
        sameSite: 'strict'
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password_hash = undefined;
    user.verification_token = undefined;
    user.reset_token = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

module.exports = {
    signToken,
    createSendToken
};
