import Wallet from '../models/walletModel.js';
import Transaction from '../models/TransactionModel.js';
import { sendNotification } from '../services/notificationService.js';
// @ts-expect-error no type for paystack-api
import Paystack from 'paystack-api';
import User from '../models/userModel.js';
import express from 'express';

// Initialize Paystack with the secret key
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

const sendOTPSMS = async (phoneNumber, otp) => {
  try {
    const message = `Your OTP code is: ${otp}`;

    const response = await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: phoneNumber,
    });

    if (!response.sid) {
      throw new Error('Failed to send OTP SMS');
    }
  } catch (error) {
    console.error('Error sending OTP SMS:', error.message);
    throw new Error('Failed to send OTP SMS');
  }
};

export const depositFunds = async (req, res, next) => {
  try {
    const { userId, amount, email, paymentMethod, cardDetails } = req.body;

    const wallet = await Wallet.findOne({ userId }).exec();
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Initialize the transaction with Paystack, including card details in metadata
    const initializeResponse = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Paystack expects the amount in kobo (NGN cents)
      metadata: {
        userId,
        paymentMethod,
        cardDetails, // Include card details in the metadata
      },
      ...(paymentMethod === 'card' && cardDetails ? {
        card: {
          number: cardDetails.cardNumber,
          cvv: cardDetails.cvc,
          expiry_month: cardDetails.expiryMonth,
          expiry_year: cardDetails.expiryYear,
          name: cardDetails.nameOnCard,
        }
      } : {}),
    });

    const { reference, authorization_url } = initializeResponse.data;

    if (paymentMethod === 'card') {
      // Simulate payment completion and verify transaction
      const verifyResponse = await paystack.transaction.verify({ reference });

      if (verifyResponse.data.status === 'success') {
        wallet.fiatBalance += amount;
        await wallet.save();

        const transaction = new Transaction({
          walletId: wallet._id,
          type: 'fiat',
          amount,
          currency: wallet.currency,
          status: 'completed',
          description: `Deposit via ${paymentMethod}`,
          reference,
        });

        await transaction.save();

        const user = await User.findById(userId);
        if (user) {
          await sendNotification(user, 'Deposit Successful', `Your deposit of ₦${amount} was successful.`);
        }

        return res.json(transaction);
      } else {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    } else {
      return res.json({ authorization_url, reference });
    }
  } catch (error) {
    next(error);
  }
};

export const withdrawFunds = async (req, res, next) => {
  try {
    const { userId, amount, bankAccount, bankCode } = req.body;
    const wallet = await Wallet.findOne({ userId }).exec();

    if (!wallet || wallet.fiatBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance or wallet not found' });
    }

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
      wallet.fiatBalance -= amount;
      await wallet.save();

      const transaction = new Transaction({
        walletId: wallet._id,
        type: 'fiat',
        amount,
        currency: wallet.currency,
        status: 'completed',
        description: `Withdrawal to bank account ${bankAccount}`,
        reference: transferResponse.data.reference,
      });

      await transaction.save();

      const user = await User.findById(userId);
      if (user) {
        await sendNotification(user, 'Withdrawal Successful', `Your withdrawal of ₦${amount} was successful.`);
      }

      return res.json(transaction);
    } else {
      return res.status(400).json({ message: 'Withdrawal failed' });
    }
  } catch (error) {
    next(error);
  }
};

export const checkBalance = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const wallet = await Wallet.findOne({ userId }).exec();
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    return res.json({
      fiatBalance: wallet.fiatBalance,
      cryptoBalance: wallet.cryptoBalance,
    });
  } catch (error) {
    next(error);
  }
};
