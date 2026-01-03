/**
 * Retirement Corpus Calculator Controller
 * 
 * This controller handles retirement corpus calculation functionality
 * 
 * Functions:
 * - calculateCorpus(currentAge, retirementAge, monthlySavings, expectedROI) - Calculate retirement corpus
 * - calculateFutureValueOfAnnuity(monthlyPayment, monthlyRate, months) - Calculate FV of annuity
 * - calculateYearWiseGrowth(monthlySavings, annualROI, years, currentAge) - Generate year-wise growth data
 * - validateInputs(currentAge, retirementAge, monthlySavings, expectedROI) - Validate input parameters
 */

/**
 * Calculate Retirement Corpus
 * @param {number} currentAge - Current age in years
 * @param {number} retirementAge - Retirement age in years
 * @param {number} monthlySavings - Monthly savings amount
 * @param {number} expectedROI - Expected annual return on investment (as percentage)
 * @returns {Promise<Object>} Retirement corpus calculation results
 */
async function calculateCorpus(currentAge, retirementAge, monthlySavings, expectedROI) {
    try {
        // Validate inputs
        validateInputs(currentAge, retirementAge, monthlySavings, expectedROI);

        // Calculate years until retirement
        const yearsUntilRetirement = retirementAge - currentAge;
        const months = yearsUntilRetirement * 12;

        // Calculate retirement corpus using Future Value of Annuity formula
        const corpus = calculateFutureValueOfAnnuity(monthlySavings, expectedROI, months);

        // Calculate totals
        const totalSavingsInvested = monthlySavings * months;
        const totalReturnsEarned = corpus - totalSavingsInvested;

        // Calculate monthly pension estimate (assuming 20 years of retirement)
        const retirementYears = 20;
        const monthlyPensionEstimate = corpus / (retirementYears * 12);

        // Generate year-wise growth data
        const yearWiseGrowth = calculateYearWiseGrowth(monthlySavings, expectedROI, yearsUntilRetirement, currentAge);

        return {
            currentAge,
            retirementAge,
            yearsUntilRetirement,
            monthlySavings,
            expectedROI,
            retirementCorpus: Math.round(corpus * 100) / 100,
            totalSavingsInvested: Math.round(totalSavingsInvested * 100) / 100,
            totalReturnsEarned: Math.round(totalReturnsEarned * 100) / 100,
            monthlyPensionEstimate: Math.round(monthlyPensionEstimate * 100) / 100,
            yearWiseGrowth
        };

    } catch (error) {
        console.error('Error calculating retirement corpus:', error);
        throw error;
    }
}

/**
 * Calculate Future Value of Annuity
 * Formula: FV = PMT × [((1 + r)^n - 1) / r]
 * @param {number} monthlyPayment - Monthly payment amount
 * @param {number} annualROI - Annual ROI (as percentage)
 * @param {number} months - Number of months
 * @returns {number} Future value (corpus)
 */
function calculateFutureValueOfAnnuity(monthlyPayment, annualROI, months) {
    const monthlyRate = annualROI / 12 / 100;

    if (monthlyRate === 0) {
        // If ROI is 0, simply multiply monthly payment by months
        return monthlyPayment * months;
    }

    const factor = Math.pow(1 + monthlyRate, months);
    const futureValue = monthlyPayment * ((factor - 1) / monthlyRate);

    return futureValue;
}

/**
 * Calculate Year-wise Growth
 * @param {number} monthlySavings - Monthly savings amount
 * @param {number} annualROI - Annual ROI (as percentage)
 * @param {number} years - Number of years
 * @param {number} currentAge - Current age
 * @returns {Array<Object>} Year-wise growth data
 */
function calculateYearWiseGrowth(monthlySavings, annualROI, years, currentAge) {
    const growthData = [];
    const monthlyRate = annualROI / 12 / 100;

    for (let year = 1; year <= years; year++) {
        const months = year * 12;
        let corpus;

        if (monthlyRate === 0) {
            corpus = monthlySavings * months;
        } else {
            const factor = Math.pow(1 + monthlyRate, months);
            corpus = monthlySavings * ((factor - 1) / monthlyRate);
        }

        const totalInvested = monthlySavings * months;

        growthData.push({
            year,
            age: currentAge + year,
            totalInvested: Math.round(totalInvested * 100) / 100,
            corpus: Math.round(corpus * 100) / 100
        });
    }

    return growthData;
}

/**
 * Validate Input Parameters
 * @param {number} currentAge - Current age
 * @param {number} retirementAge - Retirement age
 * @param {number} monthlySavings - Monthly savings
 * @param {number} expectedROI - Expected ROI
 * @throws {Error} If validation fails
 */
function validateInputs(currentAge, retirementAge, monthlySavings, expectedROI) {
    if (!currentAge || currentAge < 18 || currentAge > 100) {
        throw new Error('Current age must be between 18 and 100');
    }

    if (!retirementAge || retirementAge < 40 || retirementAge > 100) {
        throw new Error('Retirement age must be between 40 and 100');
    }

    if (retirementAge <= currentAge) {
        throw new Error('Retirement age must be greater than current age');
    }

    if (!monthlySavings || monthlySavings <= 0) {
        throw new Error('Monthly savings must be greater than 0');
    }

    if (!expectedROI || expectedROI < 1 || expectedROI > 20) {
        throw new Error('Expected ROI must be between 1% and 20%');
    }
}

module.exports = {
    calculateCorpus,
    calculateFutureValueOfAnnuity,
    calculateYearWiseGrowth,
    validateInputs
};

