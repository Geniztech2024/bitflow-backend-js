// src/routes/profileRoutes.js
import express from 'express';
import { updateKYC, changePassword, forgotPassword, resetPassword, confirmAuthCode } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/kyc', protect, updateKYC);
router.post('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/confirm-auth-code', confirmAuthCode);

export default router;
