// src/routes/transactionRoutes.js
import express from 'express';
import { depositFunds, withdrawFunds, checkBalance } from '../services/transactionService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/deposit', protect, depositFunds);
router.post('/withdraw', protect, withdrawFunds);
router.get('/balance', protect, checkBalance);

export default router;
