// src/controllers/walletController.js
import { getWalletBalance, updateWalletBalance } from '../services/walletService.js';

export const getBalance = async (req, res, next) => {
    try {
        const { currency, userId } = req.query;  // Get userId from query parameters
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const balance = await getWalletBalance(userId, currency || 'NGN');
        return res.status(200).json(balance);
    } catch (error) {
        next(error);
    }
};

export const updateBalance = async (req, res, next) => {
    try {
        const { amount, isDeposit, userId } = req.body;  // Include userId in the request body
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const updatedWallet = await updateWalletBalance(userId, amount, isDeposit);
        return res.status(200).json(updatedWallet);
    } catch (error) {
        next(error);
    }
};
