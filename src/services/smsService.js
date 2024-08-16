// src/services/smsService.js

import twilio from 'twilio';
import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioPushServiceSid = process.env.TWILIO_PUSH_SERVICE_SID;
const twilioPushUrl = `https://push.twilio.com/v1/Services/${twilioPushServiceSid}/Notifications`;

export const sendOTPSMS = async (phoneNumber, otp) => {
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

export const sendPushNotification = async (title, body, userId) => {
  try {
    const response = await axios.post(
      twilioPushUrl,
      {
        identity: userId,
        body,
        title,
      },
      {
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN,
        },
      }
    );

    if (response.status !== 201) {
      throw new Error('Failed to send push notification');
    }
  } catch (error) {
    console.error('Error sending push notification:', error.message);
    throw new Error('Failed to send push notification');
  }
};

// Example function to send transaction alert
export const sendTransactionAlert = async (userId, message) => {
  await sendPushNotification('Transaction Alert', message, userId);
};

// Example function to send crypto update
export const sendCryptoUpdate = async (userId, message) => {
  await sendPushNotification('Crypto Update', message, userId);
};

// Function to send generic notifications via SMS, Push, and Email
export const sendNotification = async ({ email, phoneNumber, pushToken, message, subject }) => {
  try {
    // Send SMS
    if (phoneNumber) {
      await sendOTPSMS(phoneNumber, message); // Assuming OTP message is used for SMS
    }

    // Send Push Notification
    if (pushToken) {
      await sendPushNotification(subject, message, pushToken);
    }

    // Send Email
    if (email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services like SendGrid, etc.
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text: message,
      };

      await transporter.sendMail(mailOptions);
    }

    return { status: 'success', message: 'Notifications sent successfully' };
  } catch (error) {
    console.error('Error sending notification:', error.message);
    throw new Error('Failed to send notification');
  }
};
