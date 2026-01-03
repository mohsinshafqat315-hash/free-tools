/**
 * FD Calculator Controller
 * 
 * This controller handles Fixed Deposit (FD) calculation functionality
 * 
 * Functions:
 * - calculateFD(principal, interestRate, tenure) - Calculate FD maturity amount
 * - calculateMaturityAmount(principal, annualRate, tenureYears, compoundingFreq) - Calculate maturity using compound interest
 * - calculateEffectiveRate(annualRate, compoundingFreq) - Calculate effective annual rate
 * - validateInputs(principal, interestRate, tenure) - Validate input parameters
 */

/**
 * Calculate FD Maturity
 * @param {number} principal - Principal amount
 * @param {number} interestRate - Annual interest rate (as percentage)
 * @param {number} tenure - Tenure in years
 * @returns {Promise<Object>} FD calculation results
 */
async function calculateFD(principal, interestRate, tenure) {
    try {
        // Validate inputs
        validateInputs(principal, interestRate, tenure);

        const COMPOUNDING_FREQUENCY = 4; // Quarterly compounding (standard for FDs in India)

        // Calculate maturity amount using compound interest formula
        const maturityAmount = calculateMaturityAmount(principal, interestRate, tenure, COMPOUNDING_FREQUENCY);

        // Calculate total interest earned
        const totalInterestEarned = maturityAmount - principal;

        // Calculate effective annual rate
        const effectiveRate = calculateEffectiveRate(interestRate, COMPOUNDING_FREQUENCY);

        return {
            principal,
            interestRate,
            tenure,
            compoundingFrequency: COMPOUNDING_FREQUENCY,
            maturityAmount: Math.round(maturityAmount * 100) / 100,
            totalInterestEarned: Math.round(totalInterestEarned * 100) / 100,
            effectiveRate: Math.round(effectiveRate * 100) / 100
        };

    } catch (error) {
        console.error('Error calculating FD:', error);
        throw error;
    }
}

/**
 * Calculate Maturity Amount using Compound Interest
 * Formula: A = P × (1 + r/n)^(n×t)
 * @param {number} principal - Principal amount
 * @param {number} annualRate - Annual interest rate (as percentage)
 * @param {number} tenureYears - Tenure in years
 * @param {number} compoundingFreq - Compounding frequency per year
 * @returns {number} Maturity amount
 */
function calculateMaturityAmount(principal, annualRate, tenureYears, compoundingFreq) {
    const rateDecimal = annualRate / 100;
    const factor = Math.pow(1 + rateDecimal / compoundingFreq, compoundingFreq * tenureYears);
    return principal * factor;
}

/**
 * Calculate Effective Annual Rate (EAR)
 * Formula: EAR = (1 + r/n)^n - 1
 * @param {number} annualRate - Annual interest rate (as percentage)
 * @param {number} compoundingFreq - Compounding frequency per year
 * @returns {number} Effective annual rate (as percentage)
 */
function calculateEffectiveRate(annualRate, compoundingFreq) {
    const rateDecimal = annualRate / 100;
    const ear = Math.pow(1 + rateDecimal / compoundingFreq, compoundingFreq) - 1;
    return ear * 100;
}

/**
 * Validate Input Parameters
 * @param {number} principal - Principal amount
 * @param {number} interestRate - Interest rate
 * @param {number} tenure - Tenure
 * @throws {Error} If validation fails
 */
function validateInputs(principal, interestRate, tenure) {
    if (!principal || principal < 1000) {
        throw new Error('Principal amount must be at least ₹1,000');
    }

    if (!interestRate || interestRate < 1 || interestRate > 15) {
        throw new Error('Interest rate must be between 1% and 15%');
    }

    if (!tenure || tenure <= 0 || tenure > 10) {
        throw new Error('Tenure must be between 1 and 10 years');
    }
}

module.exports = {
    calculateFD,
    calculateMaturityAmount,
    calculateEffectiveRate,
    validateInputs
};

