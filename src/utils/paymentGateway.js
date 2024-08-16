// src/utils/paymentGateway.js

import Paystack from 'paystack-api';

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

export const makePayment = async (userId, amount, email, type, details) => {
    try {
        // Initialize a transaction
        const initializeResponse = await paystack.transaction.initialize({
            email,
            amount: amount * 100, // Paystack expects amount in kobo
            metadata: {
                userId,
                type,
                details
            }
        });

        const { reference } = initializeResponse.data;

        // Verify the transaction
        const verifyResponse = await paystack.transaction.verify({ reference });

        if (verifyResponse.data.status === 'success') {
            return {
                status: 'success',
                transactionId: verifyResponse.data.id,
                message: 'Payment processed successfully',
                reference
            };
        } else {
            throw new Error('Payment verification failed');
        }
    } catch (error) {
        if (error instanceof Error) {
            return {
                status: 'failed',
                message: error.message
            };
        } else {
            return {
                status: 'failed',
                message: 'An unknown error occurred'
            };
        }
    }
};
