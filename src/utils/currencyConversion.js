// src/utils/currencyConversion.js

export const convertCurrency = async (cryptoBalance, currency) => {
    // Example conversion rate in USD for the total cryptocurrency balance
    const conversionRate = currency === 'NGN' ? 460 : 1;

    // Convert the balance to the target currency
    const convertedBalance = cryptoBalance * conversionRate;

    return convertedBalance;
};
