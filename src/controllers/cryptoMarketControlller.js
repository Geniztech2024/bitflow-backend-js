import { getLiveMarketData } from '../services/marketDataService.js';

export const getMarketData = async (req, res) => {
    try {
        const { cryptos } = req.query;

        // Log the received cryptos parameter
        console.log('Received cryptos:', cryptos);

        if (!cryptos) {
            return res.status(400).json({ message: 'Cryptos query parameter is required' });
        }

        // Split the cryptos into an array and log it
        const cryptoList = cryptos.split(',');
        console.log('Crypto List:', cryptoList);

        const data = await getLiveMarketData(cryptoList);

        // Log the data returned from the service
        console.log('Market Data:', data);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching market data:', error.message);

        return res.status(500).json({ message: 'Failed to fetch market data', error: error.message });
    }
};
