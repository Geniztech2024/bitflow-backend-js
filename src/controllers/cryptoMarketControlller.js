import { getLiveMarketData } from '../services/marketDataService.js';

export const getMarketData = async (req, res) => {
    try {
        const { cryptos } = req.query;
        if (!cryptos) {
            return res.status(400).json({ message: 'Cryptos query parameter is required' });
        }

        const data = await getLiveMarketData(cryptos.split(','));
        return res.status(200).json(data);
    } catch (error) {
        // Error handling
        return res.status(500).json({ message: 'Failed to fetch market data', error: error.message });
    }
};
