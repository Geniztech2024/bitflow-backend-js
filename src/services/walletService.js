// src/services/walletService.js
import Wallet from '../models/walletModel.js';
import Joi from 'joi';

// Supported currencies
const validCurrencies = ['USD', 'EUR', 'NGN', 'BTC', 'ETH'];

// Validation Schema
const currencySchema = Joi.string().valid(...validCurrencies).required();

// Fetch wallet balance based on currency
export const getWalletBalance = async (currency) => {
    try {
        // Validate currency input
        const { error } = currencySchema.validate(currency);
        if (error) throw new Error(`Invalid currency format: ${currency}`);

        const wallet = await Wallet.findOne({ currency }).exec();
        if (!wallet) {
            console.error(`Wallet not found for currency: ${currency}`);
            return null;  // Return null if wallet is not found
        }

        return {
            cryptoBalance: wallet.cryptoBalance,
            fiatBalance: wallet.fiatBalance,
            currency: wallet.currency
        };
    } catch (error) {
        console.error('Error fetching wallet balance:', error.message);
        throw new Error(`Error fetching wallet balance: ${error.message}`);
    }
};

// Update wallet balance
export const updateWalletBalance = async (currency, amount, isDeposit = true) => {
    try {
        // Validate currency input
        const { error } = currencySchema.validate(currency);
        if (error) throw new Error(`Invalid currency format: ${currency}`);

        const wallet = await Wallet.findOne({ currency }).exec();
        if (!wallet) {
            throw new Error(`Wallet not found for currency: ${currency}`);
        }

        if (isDeposit) {
            wallet.fiatBalance += amount;
        } else {
            if (wallet.fiatBalance < amount) {
                throw new Error('Insufficient balance');
            }
            wallet.fiatBalance -= amount;
        }

        await wallet.save();
        return {
            cryptoBalance: wallet.cryptoBalance,
            fiatBalance: wallet.fiatBalance,
            currency: wallet.currency
        };
    } catch (error) {
        console.error('Error updating wallet balance:', error.message);
        throw new Error(`Error updating wallet balance: ${error.message}`);
    }
};
