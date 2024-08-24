// src/controllers/walletController.js
import { getWalletBalance, updateWalletBalance } from '../services/walletService.js';

// Controller to fetch wallet balance
export const getWalletBalanceController = async (req, res) => {
    try {
        const { currency } = req.query;  // Assuming currency is passed as a query parameter
        const balance = await getWalletBalance(currency);
        if (!balance) {
            return res.status(404).json({ message: `Wallet not found for currency: ${currency}` });
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
        const { currency, amount } = req.body;  // Assuming currency and amount are passed in the request body
        const isDeposit = req.body.isDeposit || true;  // Default to deposit if not specified
        const updatedBalance = await updateWalletBalance(currency, amount, isDeposit);
        res.json(updatedBalance);
    } catch (error) {
        console.error('Error in updateWalletBalanceController:', error.message);
        res.status(500).json({ error: error.message });
    }
};
