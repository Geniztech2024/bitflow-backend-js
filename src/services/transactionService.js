import Wallet from '../models/walletModel.js';
import Transaction from '../models/TransactionModel.js';
import { updateWalletBalance } from './walletService.js';
import { sendNotification } from '../services/notificationService.js';
import { makePayment } from '../utils/paymentGateway.js';
import Paystack from 'paystack-api';

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

export const depositFunds = async (req, res, next) => {
    try {
        const { userId, amount, email, paymentMethod, cardDetails, transferDetails } = req.body;

        let paymentResult;

        if (paymentMethod === 'card') {
            if (!cardDetails || !cardDetails.cardNumber || !cardDetails.cvc || !cardDetails.pin) {
                return res.status(400).json({ message: 'Card details are required for card payments' });
            }

            paymentResult = await makePayment(userId, amount, email, 'card', {
                cardNumber: cardDetails.cardNumber,
                cvc: cardDetails.cvc,
                pin: cardDetails.pin,
            });
        } else if (paymentMethod === 'transfer') {
            if (!transferDetails || !transferDetails.bankAccount || !transferDetails.bankCode) {
                return res.status(400).json({ message: 'Transfer details are required for bank transfer payments' });
            }

            paymentResult = await makePayment(userId, amount, email, 'transfer', {
                bankAccount: transferDetails.bankAccount,
                bankCode: transferDetails.bankCode,
            });
        } else {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        if (paymentResult.status === 'success') {
            await updateWalletBalance(userId, amount, true);

            const transaction = new Transaction({
                walletId: wallet._id,
                type: 'fiat',
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

            return res.json(transaction);
        } else {
            return res.status(400).json({ message: paymentResult.message });
        }
    } catch (error) {
        next(error);
    }
};

export const withdrawFunds = async (req, res, next) => {
    try {
        const { userId, amount, bankAccount, bankCode, paymentMethod, cardDetails } = req.body;

        let withdrawResult;

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
                return res.status(400).json({ message: 'Withdrawal failed' });
            }
        } else if (paymentMethod === 'card') {
            if (!cardDetails || !cardDetails.cardNumber || !cardDetails.cvc || !cardDetails.pin) {
                return res.status(400).json({ message: 'Card details are required for card withdrawals' });
            }

            withdrawResult = await makePayment(userId, amount, null, 'card', {
                cardNumber: cardDetails.cardNumber,
                cvc: cardDetails.cvc,
                pin: cardDetails.pin,
            });
        } else {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        if (withdrawResult.status === 'success') {
            await updateWalletBalance(userId, amount, false);

            const transaction = new Transaction({
                walletId: wallet._id,
                type: 'fiat',
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

            return res.json(transaction);
        } else {
            return res.status(400).json({ message: withdrawResult.message });
        }
    } catch (error) {
        next(error);
    }
};
