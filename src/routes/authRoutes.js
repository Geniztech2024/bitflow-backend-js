// src/routes/authRoutes.js
import { Router } from 'express';
import { register, login, verifyOtp, googleAuth, googleAuthCallback, requestOtp } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.post('/request-otp', requestOtp);

export default router;
