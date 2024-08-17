// src/controllers/walletController.js
import { getWalletBalance, updateWalletBalance } from '../services/walletService.js';

export const getBalance = async (req, res, next) => {
    try {
        const { currency } = req.query;
        const userId = req.user._id;  // Assuming user ID is stored in req.user from authMiddleware
        const balance = await getWalletBalance(userId, currency || 'NGN');
        return res.status(200).json(balance);
    } catch (error) {
        next(error);
    }
};

export const updateBalance = async (req, res, next) => {
    try {
        const { amount, isDeposit } = req.body;
        const userId = req.user._id;
        const updatedWallet = await updateWalletBalance(userId, amount, isDeposit);
        return res.status(200).json(updatedWallet);
    } catch (error) {
        next(error);
    }
};
