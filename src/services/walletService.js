// src/services/walletService.js

import Wallet from '../models/walletModels.js';
import Transaction from '../models/TransactionModel.js';
import { convertCurrency } from '../utils/currencyConversion.js';

export const getWalletBalance = async (userId, currency) => {
    const wallet = await Wallet.findOne({ userId }).exec();
    if (!wallet) {
        throw new Error('Wallet not found');
    }

    // Assuming wallet.cryptoBalance is a number now
    const cryptoInCurrency = await convertCurrency(wallet.cryptoBalance, currency);

    // Convert fiat balance based on the target currency
    const fiatBalance = currency === 'NGN' ? wallet.fiatBalance * 460 : wallet.fiatBalance;

    return {
        cryptoBalance: cryptoInCurrency,
        fiatBalance,
        currency,
    };
};

export const depositFiat = async (userId, amount, currency) => {
    const wallet = await Wallet.findOne({ userId }).exec();
    if (!wallet) {
        throw new Error('Wallet not found');
    }

    // Convert the fiat amount to the wallet's currency
    const fiatAmount = currency === 'NGN' ? amount / 460 : amount;
    wallet.fiatBalance += fiatAmount;

    await wallet.save();

    const transaction = new Transaction({
        walletId: wallet._id,
        type: 'fiat',
        amount: fiatAmount,
        currency,
        status: 'completed',
        description: 'Fiat Deposit',
    });

    await transaction.save();

    return wallet;
};
