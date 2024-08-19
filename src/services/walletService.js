import Wallet from '../models/walletModel.js';

export const getWalletBalance = async (currency) => {
    try {
        const wallet = await Wallet.findOne({ currency });

        if (!wallet) {
            return null;  // Return null if wallet is not found
        }

        return {
            cryptoBalance: wallet.cryptoBalance,
            fiatBalance: wallet.fiatBalance
        };
    } catch (error) {
        console.error('Error fetching wallet balance:', error.message);
        throw new Error('Error fetching wallet balance');
    }
};

export const updateWalletBalance = async (amount, isDeposit = true) => {
    const wallet = await Wallet.findOne({}).exec();
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
