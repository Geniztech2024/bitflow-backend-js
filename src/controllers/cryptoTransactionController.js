import { transferCrypto, swapCrypto, performP2PTrade } from '../services/cryptoWalletService.js';

export const transferCryptocurrency = async (req, res) => {
    try {
        const { fromAddress, toAddress, amount, privateKey } = req.body;
        const userId = req.user?.id; // Accessing user ID from request

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!fromAddress || !toAddress || !amount) {
            return res.status(400).json({ message: 'From address, to address, and amount are required' });
        }

        const transaction = await transferCrypto(fromAddress, toAddress, amount, privateKey);
        return res.status(200).json(transaction);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to transfer crypto', error: error.message });
    }
};

export const swapCryptocurrency = async (req, res) => {
    try {
        const { fromCrypto, toCrypto, amount, fromAddress, toAddress } = req.body;
        const userId = req.user?.id; // Accessing user ID from request

        if (!userId || !fromCrypto || !toCrypto || !amount || !fromAddress || !toAddress) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const swapResult = await swapCrypto(fromAddress, toAddress, fromCrypto, toCrypto, amount);
        return res.status(200).json(swapResult);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to swap crypto', error: error.message });
    }
};

export const p2pTrade = async (req, res) => {
    try {
        const { sellerAddress, buyerAddress, amount, price, privateKey } = req.body;
        const userId = req.user?.id; // Accessing user ID from request

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!sellerAddress || !buyerAddress || !amount || !price) {
            return res.status(400).json({ message: 'Seller address, buyer address, amount, and price are required' });
        }

        const tradeResult = await performP2PTrade(sellerAddress, buyerAddress, amount, privateKey);
        return res.status(200).json(tradeResult);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to perform P2P trade', error: error.message });
    }
};
