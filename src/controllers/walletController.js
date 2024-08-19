// src/controllers/walletController.js
// src/controllers/walletController.js
import { getWalletBalance } from '../services/walletService.js';

export const getBalance = async (req, res, next) => {
    try {
        const { currency } = req.query;
        const userId = req.userId;  // Use req.userId set by middleware

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const balance = await getWalletBalance(userId, currency || 'USD');  // Default to 'USD' if currency is not provided
        if (!balance) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        return res.status(200).json(balance);
    } catch (error) {
        next(error);
    }
};


export const updateBalance = async (req, res, next) => {
    try {
        const { amount, isDeposit } = req.body;
        const userId = req.userId;  // This should now correctly use the userId from the protect middleware

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const updatedWallet = await updateWalletBalance(userId, amount, isDeposit);
        return res.status(200).json(updatedWallet);
    } catch (error) {
        next(error);
    }
};
