import {protect} from '../middleware/authMiddleware.js'
import express from 'express';
import { payElectricityBill, buyAirtime, buyData, placeBet, payCableTV } from '../controllers/utilityController.js';

const router = express.Router();

router.post('/pay-electricity', protect, payElectricityBill);
router.post('/buy-airtime', protect, buyAirtime);
router.post('/buy-data', protect, buyData);
router.post('/place-bet', protect, placeBet);
router.post('/pay-cabletv', protect, payCableTV);

export default router;
