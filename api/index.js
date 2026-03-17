// api/index.js - Vercel Serverless Function for MealCart Backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://meal-cart-phi.vercel.app';
const NODE_ENV = process.env.NODE_ENV || 'production';

console.log('[Init] Starting MealCart Backend');
console.log('[Init] Environment:', NODE_ENV);
console.log('[Init] MongoDB URI available:', !!MONGODB_URI);
console.log('[Init] Frontend URL:', FRONTEND_URL);

// CORS configuration
const corsOptions = {
  origin: [
    FRONTEND_URL,
    'https://meal-cart-phi.vercel.app',
    'https://meal-cart-bice.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://192.168.29.216:5173',
    'http://192.168.29.216:5174',
    'http://192.168.29.216:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-CSRF-Token', 'X-Api-Version']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB connection with caching
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('[DB] Using cached connection');
    return cachedConnection;
  }

  if (!MONGODB_URI) {
    console.warn('[DB] MONGODB_URI not configured');
    return null;
  }

  try {
    console.log('[DB] Connecting to MongoDB...');
    const connection = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedConnection = connection;
    console.log('[DB] Connected to MongoDB successfully');
    return connection;
  } catch (error) {
    console.error('[DB] MongoDB connection error:', error.message);
    throw error;
  }
}

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    if (MONGODB_URI) {
      await connectToDatabase();
    }
    next();
  } catch (error) {
    console.error('[Middleware] Database connection error:', error.message);
    next();
  }
});

// Health check endpoint - MUST WORK
app.get('/api/health', async (req, res) => {
  try {
    let dbStatus = 'not configured';
    if (MONGODB_URI) {
      await connectToDatabase();
      dbStatus = 'connected';
    }
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: NODE_ENV,
      version: '2.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint - MUST WORK
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '2.0.0'
  });
});

// Create a fallback router for failed imports
const createFallbackRouter = (routeName, errorMessage) => {
  const fallbackRouter = express.Router();
  fallbackRouter.use((req, res) => {
    console.log(`[Fallback] ${routeName} - service unavailable`);
    res.status(503).json({ 
      error: `${routeName} service unavailable`,
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  });
  return fallbackRouter;
};

// Import and register routes with individual error handling
const importAndRegisterRoutes = () => {
  console.log('[Routes] Starting route import...');
  
  const routesToImport = [
    { name: 'auth', path: '../backend/routes/auth', prefix: '/api/auth' },
    { name: 'recipes', path: '../backend/routes/recipes', prefix: '/api/recipes' },
    { name: 'recipes_enhanced', path: '../backend/routes/recipes_enhanced', prefix: '/api/recipes-enhanced' },
    { name: 'grocerylist', path: '../backend/routes/grocerylist', prefix: '/api/grocerylist' },
    { name: 'gemini', path: '../backend/routes/gemini', prefix: '/api/gemini' },
    { name: 'ai', path: '../backend/routes/ai', prefix: '/api/ai' },
    { name: 'users', path: '../backend/routes/users', prefix: '/api/users' }
  ];
  
  for (const route of routesToImport) {
    try {
      console.log(`[Routes] Attempting to import ${route.name} from ${route.path}...`);
      const routeModule = require(route.path);
      
      if (!routeModule) {
        throw new Error(`Module is null or undefined`);
      }
      
      console.log(`[Routes] ✓ ${route.name} routes loaded, registering on ${route.prefix}...`);
      app.use(route.prefix, routeModule);
      console.log(`[Routes] ✓ ${route.name} routes registered successfully`);
    } catch (error) {
      console.error(`[Routes] ✗ Failed to import ${route.name}:`);
      console.error(`[Routes]   Error: ${error.message}`);
      console.error(`[Routes]   Path: ${route.path}`);
      
      // Create and register a fallback router
      const fallbackRouter = createFallbackRouter(route.name, error.message);
      app.use(route.prefix, fallbackRouter);
      console.log(`[Routes] Registered fallback for ${route.name} at ${route.prefix}`);
    }
  }
  
  console.log('[Routes] All routes processed successfully');
};

// Import routes
try {
  importAndRegisterRoutes();
} catch (error) {
  console.error('[Init] Unexpected error during route import:');
  console.error('[Init] Error:', error.message);
  console.error('[Init] Stack:', error.stack);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler] Error caught:', err.message);
  console.error('[Error Handler] Stack:', err.stack);
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'An error occurred',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
