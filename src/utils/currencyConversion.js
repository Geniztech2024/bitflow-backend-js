import axios from 'axios';

const EXCHANGE_RATE_API_URL = 'https://openexchangerates.org/api/latest.json';
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;

export const convertCurrency = async (cryptoBalance, targetCurrency) => {
    try {
        const response = await axios.get(EXCHANGE_RATE_API_URL, {
            params: {
                app_id: EXCHANGE_RATE_API_KEY,
                symbols: targetCurrency, // Target currency, e.g., 'NGN'
            },
        });

        const rates = response.data.rates;
        const conversionRate = rates[targetCurrency];

        if (!conversionRate) {
            throw new Error(`Conversion rate for ${targetCurrency} not found.`);
        }

        // Convert the balance to the target currency using the live conversion rate
        const convertedBalance = cryptoBalance * conversionRate;

        return convertedBalance;
    } catch (error) {
        console.error('Error fetching conversion rate:', error.message);
        throw new Error('Failed to convert currency using live rates.');
    }
};
