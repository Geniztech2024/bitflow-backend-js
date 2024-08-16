// src/services/notificationService.js
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendNotification = async (user, subject, message) => {
    try {
        // Send SMS if phone number is available
        if (user.phoneNumber) {
            await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: user.phoneNumber,
            });
            console.log(`SMS sent to ${user.phoneNumber}`);
        } else {
            console.log('User phone number not found');
        }

        // Send Email if email address is available
        if (user.email) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject,
                text: message,
            });
            console.log(`Email sent to ${user.email}`);
        } else {
            console.log('User email address not found');
        }
    } catch (error) {
        console.error('Error sending notification:', error);
        // Consider more sophisticated error handling here
    }
};

export const notifyLiveMarketUpdate = async (userId, crypto, price) => {
    // Assuming you fetch user details by userId elsewhere
    // const user = await getUserById(userId);
    const user = {}; // Mock user object, replace with actual implementation
    await sendNotification(user, 'Market Update', `${crypto} is now at $${price}`);
};

export const notifyCryptoTransaction = async (userId, transactionType, crypto, amount) => {
    // Assuming you fetch user details by userId elsewhere
    // const user = await getUserById(userId);
    const user = {}; // Mock user object, replace with actual implementation
    await sendNotification(user, `${transactionType} Alert`, `You have ${transactionType}ed ${amount} ${crypto}`);
};
