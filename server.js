const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for simple development, enable and configure for production
}));
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' })); // Increase limit for file uploads if needed (though we use multer)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Catch-all route to serve index.html for SPA-like navigation (if needed)
// For now, we'll rely on specific html files in public/
// app.get('*', (req, res) => {
//   if (req.accepts('html')) {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
//   } else {
//     res.status(404).json({ error: 'Not found' });
//   }
// });

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  console.error(err.stack);
  
  // Don't crash the server on error
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Secure Cloud Server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
