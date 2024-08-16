import express from 'express';
import { makePayment } from '../utils/paymentGateway.js';
import Transaction from '../models/TransactionModel.js';
import Wallet from '../models/walletModel.js';

const { Request, Response, NextFunction } = express;

const payElectricityBill = async (req = Request, res = Response, next = NextFunction) => {
    try {
        const { userId, amount, email, meterNumber, distributor } = req.body;

        const wallet = await Wallet.findOne({ userId });
        if (!wallet || wallet.fiatBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance or wallet not found' });
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
            return res.json(paymentResult);
        } else {
            return res.status(400).json(paymentResult);
        }
    } catch (error) {
        next(error);
    }
};

const buyAirtime = async (req = Request, res = Response, next = NextFunction) => {
    try {
        const { userId, amount, email, phoneNumber, network } = req.body;

        const wallet = await Wallet.findOne({ userId });
        if (!wallet || wallet.fiatBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance or wallet not found' });
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
            return res.json(paymentResult);
        } else {
            return res.status(400).json(paymentResult);
        }
    } catch (error) {
        next(error);
    }
};

const buyData = async (req = Request, res = Response, next = NextFunction) => {
    try {
        const { userId, amount, email, phoneNumber, network } = req.body;

        const wallet = await Wallet.findOne({ userId });
        if (!wallet || wallet.fiatBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance or wallet not found' });
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
            return res.json(paymentResult);
        } else {
            return res.status(400).json(paymentResult);
        }
    } catch (error) {
        next(error);
    }
};

const placeBet = async (req = Request, res = Response, next = NextFunction) => {
    try {
        const { userId, amount, email, betId } = req.body;

        const wallet = await Wallet.findOne({ userId });
        if (!wallet || wallet.fiatBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance or wallet not found' });
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
            return res.json(paymentResult);
        } else {
            return res.status(400).json(paymentResult);
        }
    } catch (error) {
        next(error);
    }
};

export {
    payElectricityBill,
    buyAirtime,
    buyData,
    placeBet,
};
