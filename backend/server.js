// ============================================================
// YAS Help Desk - Main Server File
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const customerRoutes = require('./routes/customers');
const deviceRoutes = require('./routes/devices');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const maintenanceRoutes = require('./routes/maintenance');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// ============================================================
// Security Middleware
// ============================================================
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API
  crossOriginEmbedderPolicy: false
}));

// ============================================================
// CORS Configuration
// ============================================================
// For Vercel deployment, allow same-origin requests
// For local development, allow localhost
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:8000', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.VERCEL === '1') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================================
// Rate Limiting
// ============================================================
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// ============================================================
// Body Parser Middleware
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// Static Files
// ============================================================
// For Vercel, use /tmp directory. For local, use ./uploads
const uploadDir = process.env.VERCEL === '1' ? '/tmp' : (process.env.UPLOAD_DIR || './uploads');
app.use('/uploads', express.static(uploadDir));

// ============================================================
// Logging Middleware
// ============================================================
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// ============================================================
// Health Check
// ============================================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'YAS Help Desk API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================================
// API Routes
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// ============================================================
// Error Handling
// ============================================================
app.use(notFound);
app.use(errorHandler);

// ============================================================
// Server Start
// ============================================================
const PORT = process.env.PORT || 3000;

// Only listen to port if not running on Vercel
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 YAS Help Desk API Server`);
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
