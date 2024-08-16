import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './src/routes/authRoutes.js';
import cryptoRoutes from './src/routes/cryptoRoute.js';
import profileRoutes from './src/routes/profileRoute.js';
import utilityRoutes from './src/routes/utilityRoutes.js';
import transactionRoutes from './src/routes/transactionRoute.js';
import cors from 'cors';
import helmet from 'helmet';
import './src/config/passportConfig.js';
import connectDB from './src/config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Session middleware (required for Passport)
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/utilities', utilityRoutes);
app.use('/api/transactions', transactionRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Biltflow API');
});

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
