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
import tradingHistoryRoute from './src/routes/tradingHistoryRoute.js'; 
import MongoStore from 'connect-mongo';

dotenv.config();

const app = express();

// CORS options
const corsOptions = {
  origin: '*',  // Allows all origins 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));  
app.use(helmet());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Session middleware using connect-mongo
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI, // Use your MongoDB URI from environment variables
            collectionName: 'sessions', // Optional: you can specify a collection name for sessions
        }),
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
app.use('/api/tradinghistory', tradingHistoryRoute); 

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Biltflow API');
});

// Error handling middleware
app.use((error, req, res, next) => { 
    console.error(error.stack);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// Request timeout middleware
app.use((req, res, next) => {
    res.setTimeout(120000, () => {  // Set timeout to 2 minutes
        res.status(408).send('Request timed out');
    });
    next();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});