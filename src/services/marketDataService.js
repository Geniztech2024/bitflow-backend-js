// src/services/marketDataService.js
import axios from 'axios';

export const getLiveMarketData = async (cryptos) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
            },
            params: {
                symbol: cryptos.join(','),
                convert: 'USD',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw new Error('Failed to fetch market data');
    }
};


export const getHistoricalMarketData = async (symbol, interval) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
            },
            params: {
                symbol,
                interval, // E.g., 'daily', 'hourly'
                convert: 'USD',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching historical market data:', error);
        throw new Error('Failed to fetch historical market data');
    }
};

