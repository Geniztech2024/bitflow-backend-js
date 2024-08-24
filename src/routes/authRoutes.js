import express from 'express';
import { register, verifyOtp, requestOtp, login, googleAuth, googleAuthCallback } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/request-otp', requestOtp);
router.post('/login', login);
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

export default router;
