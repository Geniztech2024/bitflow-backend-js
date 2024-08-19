// src/controllers/profileController.js
import { updateKYC as updateKYCService, changePassword as changePasswordService, forgotPassword as forgotPasswordService, resetPassword as resetPasswordService, confirmAuthCode as confirmAuthCodeService, updateProfile as updateProfileService } from '../services/profileService.js';


export const updateKYC = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user is always available
        const kycData = req.body;
        const kyc = await updateKYCService(userId, kycData);
        return res.status(200).json({ message: 'KYC updated successfully', kyc });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        await changePassword(userId, currentPassword, newPassword);
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await forgotPassword(email);
        return res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        await resetPassword(resetToken, newPassword);
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const confirmAuthCode = async (req, res) => {
    try {
        const { email, authCode } = req.body;
        const user = await confirmAuthCodeService(email, authCode);
        return res.status(200).json({ message: 'Authentication code verified successfully', user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};





export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming req.user is populated by the auth middleware
        const profileData = req.body;

        // Ensure that only allowed fields can be updated
        const allowedUpdates = ['fullName', 'email', 'gender', 'phoneNumber'];
        const updates = Object.keys(profileData);

        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        const updatedUser = await updateProfileService(userId, profileData);
        return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
