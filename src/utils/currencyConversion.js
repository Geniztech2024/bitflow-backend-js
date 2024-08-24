import axios from 'axios';

const EXCHANGE_RATE_API_URL = 'https://openexchangerates.org/api/latest.json';
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;

export const convertCurrency = async (cryptoBalance, targetCurrency) => {
    try {
        // Check if API key is provided
        if (!EXCHANGE_RATE_API_KEY) {
            throw new Error('Exchange rate API key is not set.');
        }

        // Validate inputs
        if (typeof cryptoBalance !== 'number' || cryptoBalance < 0) {
            throw new Error('Invalid crypto balance.');
        }

        const response = await axios.get(EXCHANGE_RATE_API_URL, {
            params: {
                app_id: EXCHANGE_RATE_API_KEY,
                symbols: targetCurrency, // Target currency, e.g., 'NGN'
            },
        });

        // Validate response structure
        if (!response.data || !response.data.rates) {
            throw new Error('Invalid response from exchange rate API.');
        }

        const rates = response.data.rates;
        const conversionRate = rates[targetCurrency];

        if (!conversionRate) {
            throw new Error(`Conversion rate for ${targetCurrency} not found.`);
        }

        // Convert the balance to the target currency using the live conversion rate
        const convertedBalance = parseFloat((cryptoBalance * conversionRate).toFixed(2)); // Limit to 2 decimal places

        return convertedBalance;
    } catch (error) {
        console.error('Error fetching conversion rate:', error.message);
        throw new Error('Failed to convert currency using live rates.');
    }
};
