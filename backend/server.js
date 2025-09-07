// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Configure CORS with enhanced logging
const corsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming origin:', origin);
    
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Allowing origin in development:', origin);
      return callback(null, true);
    }

    // Get allowed origins from environment or use empty array
    const allowedOrigins = process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
      : [];

    console.log('Allowed origins from env:', allowedOrigins);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('No origin header, allowing request');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list or is a subdomain of an allowed origin
    const isAllowed = allowedOrigins.some(allowed => {
      try {
        const allowedUrl = new URL(allowed);
        const originUrl = new URL(origin);
        const isMatch = originUrl.hostname === allowedUrl.hostname || 
                       originUrl.hostname.endsWith('.' + allowedUrl.hostname);
        console.log(`Checking ${origin} against ${allowed}:`, isMatch);
        return isMatch;
      } catch (e) {
        console.error('Error checking origin:', e);
        return false;
      }
    });

    if (isAllowed) {
      console.log('Origin allowed:', origin);
      return callback(null, true);
    }

    console.error('CORS blocked for origin:', origin);
    console.error('Allowed origins:', allowedOrigins);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  exposedHeaders: ['set-cookie', 'authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());
// Parse cookies with secure settings
app.use(cookieParser(process.env.SESSION_SECRET, {
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