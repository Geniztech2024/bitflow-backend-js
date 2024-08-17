import express from 'express';
import { getTradingHistory } from '../controllers/tradingHistoryController.js';


const router = express.Router();

router.get('/trading-history', getTradingHistory);

export default router;
