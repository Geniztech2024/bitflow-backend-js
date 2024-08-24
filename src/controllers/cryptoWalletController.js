import Joi from 'joi';
import { createWalletAddress, generateQRCode, buyCryptoWithMoonPay, sellCryptoWithMoonPay } from '../services/cryptoWalletService.js';

// Validation schemas
const buyCryptoSchema = Joi.object({
    walletAddress: Joi.string().required(),
    amount: Joi.number().positive().required(),
    fiatCurrency: Joi.string().required(),
});

const sellCryptoSchema = Joi.object({
    walletAddress: Joi.string().required(),
    amount: Joi.number().positive().required(),
    privateKey: Joi.string().required(),
});

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
        const { error, value } = buyCryptoSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const purchase = await buyCryptoWithMoonPay(value.walletAddress, value.amount, value.fiatCurrency);
        return res.status(200).json(purchase);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to buy crypto', error: error.message });
    }
};

export const sellCryptoCurrency = async (req, res) => {
    try {
        const { error, value } = sellCryptoSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const sale = await sellCryptoWithMoonPay(value.walletAddress, value.amount, value.privateKey);
        return res.status(200).json(sale);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to sell crypto', error: error.message });
    }
};
