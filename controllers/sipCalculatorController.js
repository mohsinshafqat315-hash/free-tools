/**
 * SIP Calculator Controller
 * 
 * This controller handles SIP (Systematic Investment Plan) calculation functionality
 * 
 * Functions:
 * - calculateSIP(monthlyInvestment, investmentPeriod, expectedROI) - Calculate SIP returns
 * - calculateFutureValueOfAnnuity(monthlyPayment, monthlyRate, months) - Calculate FV of annuity
 * - calculateYearWiseGrowth(monthlyInvestment, annualROI, years) - Generate year-wise growth data
 * - validateInputs(monthlyInvestment, investmentPeriod, expectedROI) - Validate input parameters
 */

/**
 * Calculate SIP Returns
 * @param {number} monthlyInvestment - Monthly investment amount
 * @param {number} investmentPeriod - Investment period in years
 * @param {number} expectedROI - Expected annual return on investment (as percentage)
 * @returns {Promise<Object>} SIP calculation results
 */
async function calculateSIP(monthlyInvestment, investmentPeriod, expectedROI) {
    try {
        // Validate inputs
        validateInputs(monthlyInvestment, investmentPeriod, expectedROI);

        // Calculate total investment
        const months = investmentPeriod * 12;
        const totalInvestment = monthlyInvestment * months;

        // Calculate SIP returns using Future Value of Annuity formula
        const totalValue = calculateFutureValueOfAnnuity(monthlyInvestment, expectedROI, months);

        // Calculate estimated returns
        const estimatedReturns = totalValue - totalInvestment;

        // Calculate returns percentage
        const returnsPercentage = totalInvestment > 0 ? (estimatedReturns / totalInvestment) * 100 : 0;

        // Generate year-wise growth data
        const yearWiseGrowth = calculateYearWiseGrowth(monthlyInvestment, expectedROI, investmentPeriod);

        return {
            monthlyInvestment,
            investmentPeriod,
            expectedROI,
            totalInvestment: Math.round(totalInvestment * 100) / 100,
            estimatedReturns: Math.round(estimatedReturns * 100) / 100,
            totalValue: Math.round(totalValue * 100) / 100,
            returnsPercentage: Math.round(returnsPercentage * 100) / 100,
            yearWiseGrowth
        };

    } catch (error) {
        console.error('Error calculating SIP:', error);
        throw error;
    }
}

/**
 * Calculate Future Value of Annuity (for SIP)
 * Formula: FV = PMT × [((1 + r)^n - 1) / r] × (1 + r)
 * @param {number} monthlyPayment - Monthly payment amount
 * @param {number} annualROI - Annual ROI (as percentage)
 * @param {number} months - Number of months
 * @returns {number} Future value (total value)
 */
function calculateFutureValueOfAnnuity(monthlyPayment, annualROI, months) {
    const monthlyRate = annualROI / 12 / 100;

    if (monthlyRate === 0) {
        // If ROI is 0, simply multiply monthly payment by months
        return monthlyPayment * months;
    }

    const factor = Math.pow(1 + monthlyRate, months);
    // SIP formula includes (1 + r) multiplier for beginning-of-period payments
    const futureValue = monthlyPayment * ((factor - 1) / monthlyRate) * (1 + monthlyRate);

    return futureValue;
}

/**
 * Calculate Year-wise Growth
 * @param {number} monthlyInvestment - Monthly investment amount
 * @param {number} annualROI - Annual ROI (as percentage)
 * @param {number} years - Number of years
 * @returns {Array<Object>} Year-wise growth data
 */
function calculateYearWiseGrowth(monthlyInvestment, annualROI, years) {
    const growthData = [];
    const monthlyRate = annualROI / 12 / 100;

    for (let year = 1; year <= years; year++) {
        const months = year * 12;
        const totalInvestment = monthlyInvestment * months;
        let totalValue;

        if (monthlyRate === 0) {
            totalValue = totalInvestment;
        } else {
            const factor = Math.pow(1 + monthlyRate, months);
            totalValue = monthlyInvestment * ((factor - 1) / monthlyRate) * (1 + monthlyRate);
        }

        const estimatedReturns = totalValue - totalInvestment;

        growthData.push({
            year,
            totalInvestment: Math.round(totalInvestment * 100) / 100,
            estimatedReturns: Math.round(estimatedReturns * 100) / 100,
            totalValue: Math.round(totalValue * 100) / 100
        });
    }

    return growthData;
}

/**
 * Validate Input Parameters
 * @param {number} monthlyInvestment - Monthly investment
 * @param {number} investmentPeriod - Investment period
 * @param {number} expectedROI - Expected ROI
 * @throws {Error} If validation fails
 */
function validateInputs(monthlyInvestment, investmentPeriod, expectedROI) {
    if (!monthlyInvestment || monthlyInvestment < 500) {
        throw new Error('Monthly investment must be at least ₹500');
    }

    if (!investmentPeriod || investmentPeriod < 1 || investmentPeriod > 50) {
        throw new Error('Investment period must be between 1 and 50 years');
    }

    if (!expectedROI || expectedROI < 1 || expectedROI > 20) {
        throw new Error('Expected ROI must be between 1% and 20%');
    }
}

module.exports = {
    calculateSIP,
    calculateFutureValueOfAnnuity,
    calculateYearWiseGrowth,
    validateInputs
};

