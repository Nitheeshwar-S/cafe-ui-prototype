require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

// Import routes
const menuRoutes = require('./routes/menu');
const comboRoutes = require('./routes/combos');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const promoRoutes = require('./routes/promos');
const settingsRoutes = require('./routes/settings');
const kitchenRoutes = require('./routes/kitchen');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            scriptSrc: ["'self'"],
        },
    },
}));

app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // minutes from env
    max: process.env.RATE_LIMIT_MAX || 100, // requests per window from env
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || 'https://your-domain.com']
        : [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'file://' // Allow file:// protocol for local development
        ],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Atlas Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);

        // Set up connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error.message);
        process.exit(1);
    }
};

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Cafe Coffeeto API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/combos', comboRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/kitchen', kitchenRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../frontend'));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    // Default error
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Cafe Coffeeto API Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message);
    server.close(() => {
        process.exit(1);
    });
});

module.exports = app;