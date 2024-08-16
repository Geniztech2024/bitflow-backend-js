// src/models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    description: { type: String, required: true },
    reference: { type: String, required: true }
});

export default mongoose.model('Transaction', transactionSchema);
