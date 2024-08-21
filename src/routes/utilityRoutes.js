import express from 'express';
import { payElectricityBill, buyAirtime, buyData, placeBet, payCableTV } from '../controllers/utilityController.js';

const router = express.Router();

router.post('/pay-electricity', payElectricityBill);
router.post('/buy-airtime', buyAirtime);
router.post('/buy-data', buyData);
router.post('/place-bet', placeBet);
router.post('/pay-cabletv', payCableTV);

export default router;
