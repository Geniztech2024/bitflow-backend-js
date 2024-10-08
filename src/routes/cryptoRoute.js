// src/routes/cryptoRoutes.js
import { Router } from 'express';
import {
    createWallet,
    generateWalletQRCode,
    buyCryptoCurrency,
    sellCryptoCurrency
} from '../controllers/cryptoWalletController.js';

import {
    getMarketData,getHistoricalData
} from '../controllers/cryptoMarketControlller.js';

import {
    transferCryptocurrency,
    receiveCryptocurrency,
    swapCryptocurrency,
    p2pTrade
} from '../controllers/cryptoTransactionController.js';

const router = Router();

// Market Data Routes
router.get('/market', getMarketData);
router.get('/historicalMarketData', getHistoricalData);

// Wallet Routes
router.post('/wallet/create', createWallet);
router.post('/wallet/qr-code', generateWalletQRCode);
router.post('/wallet/buy', buyCryptoCurrency);
router.post('/wallet/sell', sellCryptoCurrency);

// Transaction Routes
router.post('/transaction/transfer', transferCryptocurrency);
router.post('/transaction/receive', receiveCryptocurrency); 
router.post('/transaction/swap', swapCryptocurrency);
router.post('/transaction/p2p', p2pTrade);


export default router;
