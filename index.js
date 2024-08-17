import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './src/routes/authRoutes.js';
import cryptoRoutes from './src/routes/cryptoRoute.js';
import profileRoutes from './src/routes/profileRoute.js';
import utilityRoutes from './src/routes/utilityRoutes.js';
import transactionRoutes from './src/routes/transactionRoute.js';
import walletRoutes from './src/routes/walletRoutes.js';
import cors from 'cors';
import helmet from 'helmet';
import './src/config/passportConfig.js';
import connectDB from './src/config/db.js';
import tradingHistoryRoute from './src/routes/tradingHistoryRoute.js'; // This import is correct

dotenv.config();

const app = express();

// CORS options
const corsOptions = {
  origin: '*',  // Allows all origins (for development purposes)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Allows credentials to be included in requests (optional)
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));  // Use the CORS middleware with custom options
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
app.use('/api/wallet', walletRoutes);
app.use('/api/tradinghistory', tradingHistoryRoute); // Use the correct variable name here

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Biltflow API');
});

// Error handling
app.use((req, res, next) => {
    res.setTimeout(120000, () => {  // Set timeout to 2 minutes
        res.status(408).send('Request timed out');
    });
    next();
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
