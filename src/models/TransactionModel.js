// src/models/transactionModel.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    type: { 
        type: String, 
        enum: ['deposit', 'withdrawal'], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0.01 // Minimum transaction amount
    },
    currency: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        required: true, 
        default: 'pending' 
    },
    description: { 
        type: String, 
        required: true 
    },
    reference: { 
        type: String, 
        required: true, 
        unique: true // Ensure each transaction has a unique reference
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

export default mongoose.model('Transaction', transactionSchema);
