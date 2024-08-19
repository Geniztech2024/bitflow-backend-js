// src/routes/walletRoutes.js
import express from 'express';
import { getBalance, updateBalance } from '../controllers/walletController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/balance',   getBalance);
router.put('/balance',  updateBalance); // Assuming PUT for updating balance

export default router;
