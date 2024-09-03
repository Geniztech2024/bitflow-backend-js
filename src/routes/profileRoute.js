import express from 'express';
import { updateKYC, changePassword, forgotPassword, resetPassword, confirmAuthCode, updateProfile, getProfileController } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/kyc', protect, updateKYC);
router.post('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/confirm-auth-code', confirmAuthCode);
router.put('/updateProfile', protect, updateProfile);
router.get('/profile', protect, getProfileController);

export default router;
