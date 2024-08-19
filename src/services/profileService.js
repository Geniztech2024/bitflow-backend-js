// src/services/profileService.js

import User from '../models/userModel.js';
import KYCModel from '../models/KYCModel.js'; // Import the default export
import { sendNotification, sendOTPEmail } from './smsService.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Update KYC information
export const updateKYC = async (userId, kycData) => {
    try {
        const kyc = await KYCModel.findOneAndUpdate({ userId }, kycData, { new: true, upsert: true });

        // Send notification
        await sendNotification({
            email: kycData.email,
            message: 'Your KYC information has been updated.',
            subject: 'KYC Update Successful'
        });

        return kyc;
    } catch (error) {
        console.error('Error updating KYC:', error);
        throw new Error('Failed to update KYC');
    }
};

// Change user password
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
        await sendNotification({
            email: user.email,
            message: 'Your password has been successfully changed.',
            subject: 'Password Change Successful'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        throw new Error('Failed to change password');
    }
};

// Handle forgot password
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
        await sendOTPEmail(email, resetToken);

        // Send notification
        await sendNotification({
            email,
            message: 'A password reset link has been sent to your email.',
            subject: 'Password Reset Request'
        });
    } catch (error) {
        console.error('Error handling forgot password:', error);
        throw new Error('Failed to handle forgot password');
    }
};

// Reset password
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
        await sendNotification({
            email: user.email,
            message: 'Your password has been successfully reset.',
            subject: 'Password Reset Successful'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        throw new Error('Failed to reset password');
    }
};

export const confirmAuthCode = async (email, authCode) => {
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) throw new Error('User not found');

        const hashedToken = crypto.createHash('sha256').update(authCode).digest('hex');
        if (user.passwordResetToken !== hashedToken || user.passwordResetExpires < Date.now()) {
            throw new Error('Invalid or expired authentication code');
        }

        // Clear the reset token and expiration after successful confirmation
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return user;
    } catch (error) {
        console.error('Error confirming authentication code:', error);
        throw new Error('Failed to confirm authentication code');
    }
};

// Update user profile information
export const updateProfile = async (userId, profileData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, profileData, { new: true }).exec();
        if (!updatedUser) throw new Error('User not found');

        return updatedUser;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
    }
};