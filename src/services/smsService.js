// src/services/notificationService.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send OTP via email
export const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP sent to email:', email);
    } catch (error) {
        console.error('Error sending OTP email:', error.message);
        throw new Error('Failed to send OTP email');
    }
};

// Function to send push notifications (kept for reference, no changes needed)
export const sendPushNotification = async (title, body, userId) => {
    // Implementation for sending push notifications
};

// Example function to send transaction alert (kept for reference, no changes needed)
export const sendTransactionAlert = async (userId, message) => {
    await sendPushNotification('Transaction Alert', message, userId);
};

// Example function to send crypto update (kept for reference, no changes needed)
export const sendCryptoUpdate = async (userId, message) => {
    await sendPushNotification('Crypto Update', message, userId);
};

// Function to send generic notifications via SMS, Push, and Email (kept for reference, no changes needed)
export const sendNotification = async ({ email, phoneNumber, pushToken, message, subject }) => {
    try {
        // Send OTP via email
        if (email) {
            await sendOTPEmail(email, message); // Assuming message contains OTP
        }

        // Send Push Notification
        if (pushToken) {
            await sendPushNotification(subject, message, pushToken);
        }

        return { status: 'success', message: 'Notifications sent successfully' };
    } catch (error) {
        console.error('Error sending notification:', error.message);
        throw new Error('Failed to send notification');
    }
};
