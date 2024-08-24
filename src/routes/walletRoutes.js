// src/routes/walletRoutes.js
import express from 'express';
import { getWalletBalanceController, updateWalletBalanceController } from '../controllers/walletController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/balance', protect, getWalletBalanceController);
router.put('/balance', protect, updateWalletBalanceController); // Assuming PUT for updating balance

export default router;
