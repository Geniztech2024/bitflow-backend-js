// src/services/cryptoWalletService.js
import Web3 from 'web3';
import QRCode from 'qrcode';
import axios from 'axios';
import { sendNotification } from './notificationService.js';
import User from '../models/userModel.js';

const infuraUrl = process.env.INFURA_PROJECT_URL || 'https://default-url.example.com';
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

// Function to fetch user by wallet address
const getUserByWalletAddress = async (walletAddress) => {
    return User.findOne({ walletAddress }).exec(); // Adjust query based on your schema
};

export const createWalletAddress = async () => {
    const account = web3.eth.accounts.create();
    return {
        address: account.address,
        privateKey: account.privateKey,
    };
};

export const generateQRCode = async (address) => {
    try {
        return await QRCode.toDataURL(address);
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
};

export const transferCrypto = async (fromAddress, toAddress, amount, privateKey) => {
    const tx = {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toWei(amount.toString(), 'ether'),
        gas: 21000,
    };

    try {
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        // Fetch user by address to send notifications
        const fromUser = await getUserByWalletAddress(fromAddress);
        const toUser = await getUserByWalletAddress(toAddress);

        if (fromUser) {
            await sendNotification(fromUser, 'Crypto Transfer Successful', `Transferred ${amount} ETH to ${toAddress}`);
        }
        if (toUser) {
            await sendNotification(toUser, 'Crypto Transfer Received', `You received ${amount} ETH from ${fromAddress}`);
        }

        return receipt;
    } catch (error) {
        console.error('Error transferring crypto:', error);
        throw new Error('Failed to transfer crypto');
    }
};

export const performP2PTrade = async (sellerAddress, buyerAddress, amount, privateKey) => {
    try {
        const receipt = await transferCrypto(buyerAddress, sellerAddress, amount, privateKey);

        // Fetch user by address to send notifications
        const sellerUser = await getUserByWalletAddress(sellerAddress);
        const buyerUser = await getUserByWalletAddress(buyerAddress);

        if (sellerUser) {
            await sendNotification(sellerUser, 'P2P Trade Successful', `You sold ${amount} ETH to ${buyerAddress}`);
        }
        if (buyerUser) {
            await sendNotification(buyerUser, 'P2P Trade Successful', `You bought ${amount} ETH from ${sellerAddress}`);
        }

        return receipt;
    } catch (error) {
        console.error('Error performing P2P trade:', error);
        throw new Error('Failed to perform P2P trade');
    }
};

export const swapCrypto = async (
    fromWalletAddress,
    toWalletAddress,
    fromCurrency,
    toCurrency,
    amount
) => {
    try {
        const response = await axios.post(
            'https://api.moonpay.io/v3/swap',
            {
                fromWalletAddress,
                toWalletAddress,
                fromCurrency,
                toCurrency,
                amount,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.MOONPAY_API_KEY}`,
                },
            }
        );

        const fromUser = await getUserByWalletAddress(fromWalletAddress);
        const toUser = await getUserByWalletAddress(toWalletAddress);

        if (fromUser) {
            await sendNotification(fromUser, 'Crypto Swap Successful', `You swapped ${amount} ${fromCurrency} to ${toCurrency}`);
        }
        if (toUser) {
            await sendNotification(toUser, 'Crypto Swap Received', `You received ${amount} ${toCurrency} from ${fromCurrency}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error swapping crypto with MoonPay:', error);
        throw new Error('Failed to swap crypto');
    }
};

export const sellCryptoWithMoonPay = async (walletAddress, amount, bankAccount) => {
    try {
        const response = await axios.post(
            'https://api.moonpay.io/v3/transactions/sell',
            {
                walletAddress,
                baseCurrencyAmount: amount,
                quoteCurrencyCode: 'ETH',
                bankAccount,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.MOONPAY_API_KEY}`,
                },
            }
        );

        const user = await getUserByWalletAddress(walletAddress);

        if (user) {
            await sendNotification(user, 'Crypto Sale Successful', `You sold ${amount} ETH`);
        }

        return response.data;
    } catch (error) {
        console.error('Error selling crypto with MoonPay:', error);
        throw new Error('Failed to sell crypto');
    }
};

export const buyCryptoWithMoonPay = async (walletAddress, amount, fiatCurrency) => {
    try {
        const response = await axios.post(
            'https://api.moonpay.io/v3/transactions',
            {
                walletAddress,
                baseCurrencyAmount: amount,
                baseCurrencyCode: fiatCurrency,
                quoteCurrencyCode: 'ETH',
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.MOONPAY_API_KEY}`,
                },
            }
        );

        const user = await getUserByWalletAddress(walletAddress);

        if (user) {
            await sendNotification(user, 'Crypto Purchase Successful', `You bought ${amount} ETH`);
        }

        return response.data;
    } catch (error) {
        console.error('Error buying crypto with MoonPay:', error);
        throw new Error('Failed to buy crypto');
    }
};
