// src/controllers/walletController.js
import { getWalletBalance, updateWalletBalance } from '../services/walletService.js';

// Controller to fetch wallet balance
export const getWalletBalanceController = async (req, res) => {
    try {
        const { currency } = req.query;  // Assuming currency is passed as a query parameter
        const userId = req.userId;  // Assuming userId is available in the request object

        const balance = await getWalletBalance(userId, currency);
        if (!balance) {
            return res.status(404).json({ message: `Wallet not found for userId: ${userId}, currency: ${currency}` });
        }
        res.json(balance);
    } catch (error) {
        console.error('Error in getWalletBalanceController:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Controller to update wallet balance
export const updateWalletBalanceController = async (req, res) => {
    try {
        const { currency, amount, isDeposit } = req.body;  // Assuming currency, amount, and isDeposit are passed in the request body
        const userId = req.userId;  // Assuming userId is available in the request object

        const updatedBalance = await updateWalletBalance(userId, currency, amount, isDeposit);
        res.json(updatedBalance);
    } catch (error) {
        console.error('Error in updateWalletBalanceController:', error.message);
        res.status(500).json({ error: error.message });
    }
};