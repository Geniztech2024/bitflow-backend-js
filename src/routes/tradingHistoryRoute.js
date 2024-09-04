import express from 'express';
import { getTradingHistory } from '../controllers/tradingHistoryController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/' ,protect, getTradingHistory);

export default router;
