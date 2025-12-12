import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { connectToDatabase } from './lib/db.js';
import publicRouter from './routes/public.js';
import adminRouter from './routes/admin.js';
import uploadRouter from './routes/upload.js';
import userRouter from './routes/user.js';
import ordersRouter from './routes/orders.js';

// Load environment variables first
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'PORT', 'CORS_ORIGIN', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Initialize express app
const app = express();

// Compression middleware - compress all responses
app.use(compression());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false, // Disable to allow Google OAuth popup
}));

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 20, // More lenient in development
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Much higher in development
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose?.connection?.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Cache headers for product listings (5 minutes)
app.use('/api/products', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});

// Cache headers for static product data (1 hour)
app.use('/api/public/products', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
  next();
});

// Root endpoint for Render health checks
app.get('/', (req, res) => {
  res.send('SLAY API is running');
});

// API Routes
app.use('/api', apiLimiter, publicRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/user/register', authLimiter); // Rate limit registration
app.use('/api/user/login', authLimiter); // Rate limit login
app.use('/api/user', userRouter);
app.use('/api/orders', ordersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5001;

async function start() {
  await connectToDatabase();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


