import {
    updateKYCValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    confirmAuthCodeValidation,
    updateProfileValidation,
} from '../middleware/profileValidation.js';

import {
    getProfile as getProfileService,
    updateKYC as updateKYCService,
    changePassword as changePasswordService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService,
    confirmAuthCode as confirmAuthCodeService,
    updateProfile as updateProfileService,
} from '../services/profileService.js';

export const getProfileController = async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming user ID is stored in the request object
        const profile = await getProfileService(userId);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateKYC = async (req, res) => {
    try {
        const { error } = updateKYCValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const userId = req.user.id;
        const kycData = req.body;
        const kyc = await updateKYCService(userId, kycData);
        res.status(200).json({ message: 'KYC updated successfully', kyc });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { error } = changePasswordValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        await changePasswordService(userId, currentPassword, newPassword);
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { error } = forgotPasswordValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email } = req.body;
        await forgotPasswordService(email);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { error } = resetPasswordValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { resetToken, newPassword } = req.body;
        await resetPasswordService(resetToken, newPassword);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const confirmAuthCode = async (req, res) => {
    try {
        const { error } = confirmAuthCodeValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, authCode } = req.body;
        const user = await confirmAuthCodeService(email, authCode);
        res.status(200).json({ message: 'Authentication code verified successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { error } = updateProfileValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const userId = req.user.id;
        const profileData = req.body;

        const updatedUser = await updateProfileService(userId, profileData);
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
