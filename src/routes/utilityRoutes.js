// src/routes/utilityRoutes.js
import express from 'express';
import {
    payElectricityBill,
    buyAirtime,
    buyData,
    placeBet
} from '../services/utilityService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/pay-electricity-bill', protect, payElectricityBill);
router.post('/buy-airtime', protect, buyAirtime);
router.post('/buy-data', protect, buyData);
router.post('/place-bet', protect, placeBet);

export default router;
