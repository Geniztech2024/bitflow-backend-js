// src/services/profileService.js
import User from '../models/userModel.js';
import KYCModel from '../models/KYCModel.js'; // Import the default export
import { sendNotification,  } from './notificationService.js';
import {sendOTPSMS} from './smsService.js'
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const updateKYC = async (userId, kycData) => {
    try {
        const kyc = await KYCModel.findOneAndUpdate({ userId }, kycData, { new: true, upsert: true });
        // Send notification
        await sendNotification(userId, 'KYC Update Successful', 'Your KYC information has been updated.');
        return kyc;
    } catch (error) {
        console.error('Error updating KYC:', error);
        throw new Error('Failed to update KYC');
    }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await User.findById(userId).exec();
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw new Error('Incorrect current password');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Send notification
        await sendNotification(user.email, 'Password Change Successful', 'Your password has been successfully changed.');
    } catch (error) {
        console.error('Error changing password:', error);
        throw new Error('Failed to change password');
    }
};

export const forgotPassword = async (email) => {
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) throw new Error('User not found');

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send OTP to email
        await otpService.sendOTP(email, resetToken);

        // Send notification
        await sendNotification(email, 'Password Reset Request', 'A password reset link has been sent to your email.');
    } catch (error) {
        console.error('Error handling forgot password:', error);
        throw new Error('Failed to handle forgot password');
    }
};

export const resetPassword = async (resetToken, newPassword) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        }).exec();
        if (!user) throw new Error('Invalid or expired reset token');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // Send notification
        await sendNotification(user.email, 'Password Reset Successful', 'Your password has been successfully reset.');
    } catch (error) {
        console.error('Error resetting password:', error);
        throw new Error('Failed to reset password');
    }
};
