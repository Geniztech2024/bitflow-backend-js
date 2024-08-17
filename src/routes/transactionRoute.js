// src/routes/transactionRoutes.js
import express from 'express';
import { depositFunds, withdrawFunds } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/deposit', protect, depositFunds);
router.post('/withdraw', protect, withdrawFunds);

export default router;
