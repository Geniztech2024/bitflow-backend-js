// src/models/walletModel.js
import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    cryptoBalance: {
        type: Number,
        default: 0,
        required: true
    },
    fiatBalance: {
        type: Number,
        default: 0,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USD' // Set a default currency if necessary
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
