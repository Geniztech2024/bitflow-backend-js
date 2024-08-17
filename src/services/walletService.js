import Wallet from '../models/walletModel.js';
import { convertCurrency } from '../utils/currencyConversion.js';

export const getWalletBalance = async (userId, currency) => {
    const wallet = await Wallet.findOne({ userId }).exec();
    if (!wallet) {
        throw new Error('Wallet not found');
    }

    const cryptoInCurrency = await convertCurrency(wallet.cryptoBalance, currency);
    const fiatBalance = currency === 'NGN' ? wallet.fiatBalance * 460 : wallet.fiatBalance;

    return {
        cryptoBalance: cryptoInCurrency,
        fiatBalance,
        currency,
    };
};

export const updateWalletBalance = async (userId, amount, isDeposit = true) => {
    const wallet = await Wallet.findOne({ userId }).exec();
    if (!wallet) {
        throw new Error('Wallet not found');
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
    return wallet;
};
