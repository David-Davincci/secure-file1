// Vercel serverless function entry point
const app = require('../server');

// Export the Express app as a serverless function handler
module.exports = async (req, res) => {
    // Let Express handle the request
    return app(req, res);
};
