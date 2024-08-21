import { makePayment } from '../utils/paymentGateway.js';
import Transaction from '../models/TransactionModel.js';
import Wallet from '../models/walletModel.js';

const payElectricityBill = async (req) => {
    const { userId, amount, email, meterNumber, distributor } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.fiatBalance < amount) {
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { meterNumber, distributor };
    const paymentResult = await makePayment(userId, amount, email, 'electricity', paymentDetails);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();

        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'fiat',
            amount,
            currency: wallet.currency,
            status: 'completed',
            description: `Electricity bill payment to ${distributor}`,
            reference: paymentResult.reference,
        });

        await transaction.save();
        return paymentResult;
    } else {
        throw new Error(paymentResult.message || 'Payment failed');
    }
};

const buyAirtime = async (req) => {
    const { userId, amount, email, phoneNumber, network } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.fiatBalance < amount) {
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { phoneNumber, network };
    const paymentResult = await makePayment(userId, amount, email, 'airtime', paymentDetails);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();

        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'fiat',
            amount,
            currency: wallet.currency,
            status: 'completed',
            description: `Airtime top-up for ${phoneNumber} on ${network}`,
            reference: paymentResult.reference,
        });

        await transaction.save();
        return paymentResult;
    } else {
        throw new Error(paymentResult.message || 'Payment failed');
    }
};

const buyData = async (req) => {
    const { userId, amount, email, phoneNumber, network } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.fiatBalance < amount) {
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { phoneNumber, network };
    const paymentResult = await makePayment(userId, amount, email, 'data', paymentDetails);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();

        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'fiat',
            amount,
            currency: wallet.currency,
            status: 'completed',
            description: `Data top-up for ${phoneNumber} on ${network}`,
            reference: paymentResult.reference,
        });

        await transaction.save();
        return paymentResult;
    } else {
        throw new Error(paymentResult.message || 'Payment failed');
    }
};

const placeBet = async (req) => {
    const { userId, amount, email, betId } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.fiatBalance < amount) {
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { betId };
    const paymentResult = await makePayment(userId, amount, email, 'sportsbetting', paymentDetails);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();

        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'fiat',
            amount,
            currency: wallet.currency,
            status: 'completed',
            description: `Sports betting payment for Bet ID ${betId}`,
            reference: paymentResult.reference,
        });

        await transaction.save();
        return paymentResult;
    } else {
        throw new Error(paymentResult.message || 'Payment failed');
    }
};

const payCableTV = async (req) => {
    const { userId, amount, email, decoderNumber, provider } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.fiatBalance < amount) {
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { decoderNumber, provider };
    const paymentResult = await makePayment(userId, amount, email, 'cabletv', paymentDetails);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();

        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'fiat',
            amount,
            currency: wallet.currency,
            status: 'completed',
            description: `Cable TV payment to ${provider}`,
            reference: paymentResult.reference,
        });

        await transaction.save();
        return paymentResult;
    } else {
        throw new Error(paymentResult.message || 'Payment failed');
    }
};

export {
    payElectricityBill,
    buyAirtime,
    buyData,
    placeBet,
    payCableTV,
};
