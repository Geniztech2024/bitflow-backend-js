// src/models/walletModel.js
import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true,   
        unique: true
    },

    cryptoBalance: {
        type: Number,
        default: 0,
        required: true,
        min: 0 // Ensure balance cannot be negative
    },
    fiatBalance: {
        type: Number,
        default: 0,
        required: true,
        min: 0 // Ensure balance cannot be negative
    },
    currency: {
        type: String,
        required: true,
        default: 'USD',
        enum: ['USD', 'EUR', 'NGN', 'BTC', 'ETH'] // Limit to supported currencies
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
