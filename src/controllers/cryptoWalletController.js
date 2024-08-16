import { createWalletAddress, generateQRCode, buyCryptoWithMoonPay, sellCryptoWithMoonPay } from '../services/cryptoWalletService.js';

export const createWallet = async (req, res) => {
    try {
        const wallet = await createWalletAddress();
        return res.status(201).json(wallet);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create wallet', error: error.message });
    }
};

export const generateWalletQRCode = async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        const qrCode = await generateQRCode(address);
        return res.status(200).json({ qrCode });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to generate QR code', error: error.message });
    }
};

export const buyCryptoCurrency = async (req, res) => {
    try {
        const { walletAddress, amount, fiatCurrency } = req.body;
        if (!walletAddress || !amount || !fiatCurrency) {
            return res.status(400).json({ message: 'Wallet address, amount, and fiat currency are required' });
        }

        const purchase = await buyCryptoWithMoonPay(walletAddress, amount, fiatCurrency);
        return res.status(200).json(purchase);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to buy crypto', error: error.message });
    }
};

export const sellCryptoCurrency = async (req, res) => {
    try {
        const { walletAddress, amount, bankAccount, privateKey } = req.body;

        if (!walletAddress || !amount || !bankAccount || !privateKey) {
            return res.status(400).json({ message: 'Wallet address, amount, bank account, and private key are required' });
        }

        const sale = await sellCryptoWithMoonPay(walletAddress, amount, bankAccount, privateKey);
        return res.status(200).json(sale);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to sell crypto', error: error.message });
    }
};
