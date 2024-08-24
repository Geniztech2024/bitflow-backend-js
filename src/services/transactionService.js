// src/services/transactionService.js
import Wallet from '../models/walletModel.js';
import Transaction from '../models/TransactionModel.js';
import { updateWalletBalance } from './walletService.js';
import { sendNotification } from '../services/notificationService.js';
import { makePayment } from '../utils/paymentGateway.js';
import Paystack from 'paystack-api';

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

export const depositFunds = async ({ userId, amount, email, paymentMethod, cardDetails, transferDetails }) => {
    let paymentResult;

    // Handle different payment methods
    if (paymentMethod === 'card') {
        if (!cardDetails || !cardDetails.cardNumber || !cardDetails.cvc || !cardDetails.pin) {
            throw new Error('Card details are required for card payments');
        }

        paymentResult = await makePayment(userId, amount, email, 'card', {
            cardNumber: cardDetails.cardNumber,
            cvc: cardDetails.cvc,
            pin: cardDetails.pin,
        });
    } else if (paymentMethod === 'transfer') {
        if (!transferDetails || !transferDetails.bankAccount || !transferDetails.bankCode) {
            throw new Error('Transfer details are required for bank transfer payments');
        }

        paymentResult = await makePayment(userId, amount, email, 'transfer', {
            bankAccount: transferDetails.bankAccount,
            bankCode: transferDetails.bankCode,
        });
    } else {
        throw new Error('Invalid payment method');
    }

    // Process successful payment
    if (paymentResult.status === 'success') {
        await updateWalletBalance(userId, amount, true);

        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'deposit',
            amount,
            currency: 'NGN',
            status: 'completed',
            description: `Deposit via ${paymentMethod}`,
            reference: paymentResult.reference,
        });

        await transaction.save();

        const user = await User.findById(userId);
        if (user) {
            await sendNotification(user, 'Deposit Successful', `Your deposit of ₦${amount} was successful.`);
        }

        return transaction;
    } else {
        throw new Error(paymentResult.message);
    }
};

export const withdrawFunds = async ({ userId, amount, bankAccount, bankCode, paymentMethod, cardDetails }) => {
    let withdrawResult;

    // Handle withdrawal via bank transfer
    if (paymentMethod === 'transfer') {
        const recipientResponse = await paystack.transferRecipient.create({
            type: 'nuban',
            name: userId,
            account_number: bankAccount,
            bank_code: bankCode,
            currency: 'NGN',
        });

        const recipientCode = recipientResponse.data.recipient_code;

        const transferResponse = await paystack.transfer.create({
            source: 'balance',
            reason: 'Withdrawal to bank',
            amount: amount * 100,
            recipient: recipientCode,
        });

        if (transferResponse.data.status === 'success') {
            withdrawResult = { status: 'success', reference: transferResponse.data.reference };
        } else {
            throw new Error('Withdrawal failed');
        }
    } else if (paymentMethod === 'card') {
        if (!cardDetails || !cardDetails.cardNumber || !cardDetails.cvc || !cardDetails.pin) {
            throw new Error('Card details are required for card withdrawals');
        }

        withdrawResult = await makePayment(userId, amount, null, 'card', {
            cardNumber: cardDetails.cardNumber,
            cvc: cardDetails.cvc,
            pin: cardDetails.pin,
        });
    } else {
        throw new Error('Invalid payment method');
    }

    // Process successful withdrawal
    if (withdrawResult.status === 'success') {
        await updateWalletBalance(userId, amount, false);

        const transaction = new Transaction({
            walletId: wallet._id,
            type: 'withdrawal',
            amount,
            currency: 'NGN',
            status: 'completed',
            description: `Withdrawal via ${paymentMethod}`,
            reference: withdrawResult.reference,
        });

        await transaction.save();

        const user = await User.findById(userId);
        if (user) {
            await sendNotification(user, 'Withdrawal Successful', `Your withdrawal of ₦${amount} was successful.`);
        }

        return transaction;
    } else {
        throw new Error(withdrawResult.message);
    }
};
