import mongoose from 'mongoose';

const tradingHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transactionType: { type: String, enum: ['TRANSFER', 'SWAP', 'P2P_TRADE'], required: true },
    fromAddress: { type: String, required: true },
    toAddress: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
    createdAt: { type: Date, default: Date.now },
    transactionHash: { type: String, required: true },
});

export default mongoose.model('TradingHistory', tradingHistorySchema);
