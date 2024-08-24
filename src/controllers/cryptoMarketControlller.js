import { getLiveMarketData } from '../services/marketDataService.js';
import { getHistoricalMarketData } from '../services/marketDataService.js';

export const getMarketData = async (req, res) => {
    try {
        const { cryptos } = req.query;

        if (!cryptos) {
            return res.status(400).json({ message: 'Cryptos query parameter is required' });
        }

        const cryptoList = cryptos.split(',');

        const data = await getLiveMarketData(cryptoList);

        // Format the data to match the frontend requirements
        const formattedData = cryptoList.reduce((acc, crypto) => {
            if (data.data && data.data[crypto]) {
                acc[crypto] = {
                    name: data.data[crypto].name,
                    symbol: data.data[crypto].symbol,
                    price: data.data[crypto].quote.USD.price,
                    high: data.data[crypto].quote.USD.percent_change_24h, // Adjust based on your needs
                    low: data.data[crypto].quote.USD.percent_change_24h,  // Adjust based on your needs
                    volBTC: data.data[crypto].quote.USD.volume_24h, // Adjust based on your needs
                    volETH: data.data[crypto].quote.USD.volume_24h, // Adjust based on your needs
                    currentPrice: data.data[crypto].quote.USD.price,
                    percentageChange: data.data[crypto].quote.USD.percent_change_24h
                };
            }
            return acc;
        }, {});

        return res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching market data:', error.message);
        return res.status(500).json({ message: 'Failed to fetch market data', error: error.message });
    }
};




export const getHistoricalData = async (req, res) => {
    try {
        const { symbol, interval } = req.query;

        if (!symbol || !interval) {
            return res.status(400).json({ message: 'Symbol and interval query parameters are required' });
        }

        const data = await getHistoricalMarketData(symbol, interval);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching historical market data:', error.message);
        return res.status(500).json({ message: 'Failed to fetch historical market data', error: error.message });
    }
};

