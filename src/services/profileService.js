import User from '../models/userModel.js';
import KYCModel from '../models/KYCModel.js';
import { sendNotification, sendOTPEmail } from './smsService.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const getProfile = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password').exec();
        if (!user) throw new Error('User not found');

        const kyc = await KYCModel.findOne({ userId }).exec();

        return {
            user,
            kyc,
        };
    } catch (error) {
        console.error('Error getting profile:', error);
        throw new Error('Failed to get profile');
    }
};

export const updateKYC = async (userId, kycData) => {
    try {
        const kyc = await KYCModel.findOneAndUpdate(
            { userId },
            kycData,
            { new: true, upsert: true }
        );

        const user = await User.findById(userId).exec();
        await sendNotification({
            email: user.email,
            message: 'Your KYC information has been updated.',
            subject: 'KYC Update Successful',
        });

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

        await sendNotification({
            email: user.email,
            message: 'Your password has been successfully changed.',
            subject: 'Password Change Successful',
        });
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

        await sendOTPEmail(email, resetToken);

        await sendNotification({
            email,
            message: 'A password reset link has been sent to your email.',
            subject: 'Password Reset Request',
        });
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

        await sendNotification({
            email: user.email,
            message: 'Your password has been successfully reset.',
            subject: 'Password Reset Successful',
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

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return user;
    } catch (error) {
        console.error('Error confirming authentication code:', error);
        throw new Error('Failed to confirm authentication code');
    }
};

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
