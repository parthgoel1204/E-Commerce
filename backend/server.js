// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Debug environment
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  MONGO_URI: !!process.env.MONGO_URI,
});

// Parse allowed origins from env (comma-separated)
const raw = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = raw.split(',')
  .map(s => s.trim())
  .filter(Boolean);

console.log('Allowed origins:', allowedOrigins);

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS incoming origin:', origin);

    // Allow requests with no origin (e.g., server-to-server, mobile clients, curl)
    if (!origin) return callback(null, true);

    // If whitelist empty -> deny (safer), or allow only localhost for dev
    if (allowedOrigins.length === 0) {
      console.warn('CORS: empty whitelist, blocking origin:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any netlify app subdomain
    if (origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }

    console.warn('CORS blocked for origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie', 'authorization']
};

// Apply CORS with the configured options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Request logging for debugging
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    cookie: req.headers.cookie ? true : false
  });
  next();
});
app.use(express.json());
// Parse cookies with secure settings
app.use(cookieParser(process.env.JWT_SECRET, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const cartRoutes = require('./routes/cart');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));