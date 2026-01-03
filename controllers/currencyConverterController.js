/**
 * Currency Converter Controller
 * 
 * This controller handles currency conversion functionality
 * 
 * Functions:
 * - convertCurrency(amount, fromCurrency, toCurrency) - Convert currency
 * - fetchExchangeRate(fromCurrency, toCurrency) - Fetch exchange rate from API
 * - validateCurrencyCodes(fromCurrency, toCurrency) - Validate currency codes
 * - calculateConversion(amount, exchangeRate) - Calculate converted amount
 */

/**
 * Convert Currency
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code (e.g., "USD", "EUR")
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<Object>} Conversion result with exchange rate and converted amount
 */
async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        // Validate inputs
        validateCurrencyCodes(fromCurrency, toCurrency);

        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        // Fetch exchange rate
        const exchangeRate = await fetchExchangeRate(fromCurrency, toCurrency);

        // Calculate converted amount
        const convertedAmount = calculateConversion(amount, exchangeRate);

        const now = new Date().toISOString();

        return {
            amount,
            fromCurrency,
            toCurrency,
            exchangeRate: Math.round(exchangeRate * 100000) / 100000, // Round to 5 decimal places
            convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
            conversionDate: now,
            lastUpdated: now
        };

    } catch (error) {
        console.error('Error converting currency:', error);
        throw error;
    }
}

/**
 * Fetch Exchange Rate from API
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<number>} Exchange rate
 */
async function fetchExchangeRate(fromCurrency, toCurrency) {
    // TODO: Implement exchange rate fetching
    // Options:
    // 1. ExchangeRate-API (free tier available): https://www.exchangerate-api.com/
    // 2. CurrencyAPI (free tier available): https://currencyapi.net/
    // 3. Fixer.io (paid, reliable): https://fixer.io/
    // 4. Open Exchange Rates (free tier available): https://openexchangerates.org/
    // 
    // Example implementation:
    // const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    // const data = await response.json();
    // return data.rates[toCurrency];
    //
    // Note: Cache rates for performance (update every 1-24 hours depending on API)

    // Placeholder - return mock rate
    // In production, this should fetch from a real API
    return 1;
}

/**
 * Calculate Conversion
 * @param {number} amount - Amount to convert
 * @param {number} exchangeRate - Exchange rate
 * @returns {number} Converted amount
 */
function calculateConversion(amount, exchangeRate) {
    return amount * exchangeRate;
}

/**
 * Validate Currency Codes
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @throws {Error} If validation fails
 */
function validateCurrencyCodes(fromCurrency, toCurrency) {
    const validCurrencies = [
        'USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY',
        'SGD', 'HKD', 'NZD', 'KRW', 'BRL', 'MXN', 'ZAR', 'RUB', 'AED', 'SAR', 'THB'
    ];

    if (!fromCurrency || !validCurrencies.includes(fromCurrency.toUpperCase())) {
        throw new Error(`Invalid from currency code: ${fromCurrency}`);
    }

    if (!toCurrency || !validCurrencies.includes(toCurrency.toUpperCase())) {
        throw new Error(`Invalid to currency code: ${toCurrency}`);
    }

    if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
        throw new Error('From and to currencies must be different');
    }
}

module.exports = {
    convertCurrency,
    fetchExchangeRate,
    calculateConversion,
    validateCurrencyCodes
};

