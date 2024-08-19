import { getWalletBalance, updateWalletBalance } from '../services/walletService.js';

export const getBalance = async (req, res, next) => {
    try {
        const { currency } = req.query;
        const balance = await getWalletBalance(currency || 'USD');  // Default to 'USD' if currency is not provided
        
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
        const updatedWallet = await updateWalletBalance(amount, isDeposit);
        return res.status(200).json(updatedWallet);
    } catch (error) {
        next(error);
    }
};
