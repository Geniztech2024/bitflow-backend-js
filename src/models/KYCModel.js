// src/models/KYCModel.js
import mongoose from 'mongoose';

const KYCSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: String,
    dateOfBirth: Date,
    gender: String,
    nationality: String,
    idDocument: String, // URL to uploaded ID document
    addressProof: String, // URL to uploaded address proof
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const KYCModel = mongoose.model('KYC', KYCSchema);

export default KYCModel; // Ensure it's exported as default
