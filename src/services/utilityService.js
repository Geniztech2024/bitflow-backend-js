import { makePayment } from '../utils/paymentGateway.js';
import Transaction from '../models/TransactionModel.js';
import Wallet from '../models/walletModel.js';

const validateUserId = (userId) => {
    console.log('Validating User ID:', userId);
    if (!userId) {
        throw new Error('User ID is required');
    }
};

const payElectricityBill = async (req) => {
    const { amount, email, meterNumber, distributor } = req.body;
    const userId = req.userId;
    console.log('Received User ID:', req.userId);
    // Validate user ID
    validateUserId(userId);
    console.log(`Received payElectricityBill request with userId: ${userId}, amount: ${amount}, email: ${email}, meterNumber: ${meterNumber}, distributor: ${distributor}`);
    
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        console.log(`Wallet not found for userId: ${userId}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    if (wallet.fiatBalance < amount) {
        console.log(`Insufficient balance. User's balance: ${wallet.fiatBalance}, required amount: ${amount}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { meterNumber, distributor };
    const paymentResult = await makePayment(userId, amount, email, 'electricity', paymentDetails);
    console.log(`Payment result: ${JSON.stringify(paymentResult)}`);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();
        console.log(`Updated wallet balance: ${wallet.fiatBalance}`);

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
        console.log(`Transaction saved: ${transaction._id}`);

        return paymentResult;
    } else {
        console.log(`Payment failed: ${paymentResult.message}`);
        throw new Error(paymentResult.message || 'Payment failed');
    }
};

const buyAirtime = async (req) => {
    const { amount, email, phoneNumber, network } = req.body;
    const userId = req.userId;

    // Validate user ID
    validateUserId(userId);
    console.log(`Received buyAirtime request with userId: ${userId}`);

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        console.log(`Wallet not found for userId: ${userId}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    if (wallet.fiatBalance < amount) {
        console.log(`Insufficient balance. User's balance: ${wallet.fiatBalance}, required amount: ${amount}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { phoneNumber, network };
    console.log(`Attempting to make payment with details: ${JSON.stringify(paymentDetails)}`);

    const paymentResult = await makePayment(userId, amount, email, 'airtime', paymentDetails);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();
        console.log(`Payment successful. New wallet balance: ${wallet.fiatBalance}`);

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
        console.log(`Transaction saved successfully: ${transaction}`);

        return paymentResult;
    } else {
        console.log(`Payment failed with message: ${paymentResult.message}`);
        throw new Error(paymentResult.message || 'Payment failed');
    }
};

const buyData = async (req) => {
    const { amount, email, phoneNumber, network } = req.body;
    const userId = req.userId;

    // Validate user ID
    validateUserId(userId);
    console.log(`Received buyData request with userId: ${userId}`);

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        console.log(`Wallet not found for userId: ${userId}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    if (wallet.fiatBalance < amount) {
        console.log(`Insufficient balance. User's balance: ${wallet.fiatBalance}, required amount: ${amount}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { phoneNumber, network };
    console.log(`Attempting to make payment with details: ${JSON.stringify(paymentDetails)}`);

    const paymentResult = await makePayment(userId, amount, email, 'data', paymentDetails);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();
        console.log(`Payment successful. New wallet balance: ${wallet.fiatBalance}`);

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
        console.log(`Transaction saved successfully: ${transaction}`);

        return paymentResult;
    } else {
        console.log(`Payment failed with message: ${paymentResult.message}`);
        throw new Error(paymentResult.message || 'Payment failed');
    }
};

const placeBet = async (req) => {
    const { amount, email, betId } = req.body;
    const userId = req.userId;

    // Validate user ID
    validateUserId(userId);
    console.log(`Received placeBet request with userId: ${userId}`);

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        console.log(`Wallet not found for userId: ${userId}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    if (wallet.fiatBalance < amount) {
        console.log(`Insufficient balance. User's balance: ${wallet.fiatBalance}, required amount: ${amount}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { betId };
    console.log(`Attempting to make payment with details: ${JSON.stringify(paymentDetails)}`);

    const paymentResult = await makePayment(userId, amount, email, 'sportsbetting', paymentDetails);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();
        console.log(`Payment successful. New wallet balance: ${wallet.fiatBalance}`);

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
        console.log(`Transaction saved successfully: ${transaction}`);

        return paymentResult;
    } else {
        console.log(`Payment failed with message: ${paymentResult.message}`);
        throw new Error(paymentResult.message || 'Payment failed');
    }
};

const payCableTV = async (req) => {
    const { amount, email, decoderNumber, provider } = req.body;
    const userId = req.userId;

    // Validate user ID
    validateUserId(userId);
    console.log(`Received payCableTV request with userId: ${userId}`);

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        console.log(`Wallet not found for userId: ${userId}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    if (wallet.fiatBalance < amount) {
        console.log(`Insufficient balance. User's balance: ${wallet.fiatBalance}, required amount: ${amount}`);
        throw new Error('Insufficient balance or wallet not found');
    }

    const paymentDetails = { decoderNumber, provider };
    console.log(`Attempting to make payment with details: ${JSON.stringify(paymentDetails)}`);

    const paymentResult = await makePayment(userId, amount, email, 'cabletv', paymentDetails);

    if (paymentResult.status === 'success') {
        wallet.fiatBalance -= amount;
        await wallet.save();
        console.log(`Payment successful. New wallet balance: ${wallet.fiatBalance}`);

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
        console.log(`Transaction saved successfully: ${transaction}`);

        return paymentResult;
    } else {
        console.log(`Payment failed with message: ${paymentResult.message}`);
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
