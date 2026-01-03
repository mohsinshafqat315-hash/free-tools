/**
 * Interest Calculator Controller
 * 
 * This controller handles Simple and Compound Interest calculation functionality
 * 
 * Functions:
 * - calculateInterest(principal, interestRate, timePeriod, interestType) - Calculate interest
 * - calculateSimpleInterest(principal, rate, time) - Calculate simple interest
 * - calculateCompoundInterest(principal, rate, time) - Calculate compound interest
 * - generateYearWiseBreakdown(principal, rate, time, interestType) - Generate breakdown
 * - validateInputs(principal, interestRate, timePeriod, interestType) - Validate inputs
 */

/**
 * Calculate Interest (Simple or Compound)
 * @param {number} principal - Principal amount
 * @param {number} interestRate - Annual interest rate (as percentage, e.g., 8.5 for 8.5%)
 * @param {number} timePeriod - Time period in years
 * @param {string} interestType - 'simple' or 'compound'
 * @returns {Promise<Object>} Interest calculation results with breakdown
 */
async function calculateInterest(principal, interestRate, timePeriod, interestType) {
    try {
        // Validate inputs
        validateInputs(principal, interestRate, timePeriod, interestType);

        let interestAmount, totalAmount;

        if (interestType === 'simple') {
            const result = calculateSimpleInterest(principal, interestRate, timePeriod);
            interestAmount = result.interest;
            totalAmount = result.totalAmount;
        } else {
            const result = calculateCompoundInterest(principal, interestRate, timePeriod);
            interestAmount = result.interest;
            totalAmount = result.totalAmount;
        }

        // Generate year-wise breakdown
        const yearWiseBreakdown = generateYearWiseBreakdown(principal, interestRate, timePeriod, interestType);

        // Calculate growth rate (interest as percentage of principal)
        const growthRate = (interestAmount / principal) * 100;

        // Round values to 2 decimal places
        interestAmount = Math.round(interestAmount * 100) / 100;
        totalAmount = Math.round(totalAmount * 100) / 100;
        const growthRateRounded = Math.round(growthRate * 100) / 100;

        return {
            principal,
            interestRate,
            timePeriod,
            interestType,
            interestAmount,
            totalAmount,
            growthRate: growthRateRounded,
            yearWiseBreakdown: yearWiseBreakdown.map(item => ({
                year: item.year,
                principalAtStart: Math.round(item.principalAtStart * 100) / 100,
                interestForYear: Math.round(item.interestForYear * 100) / 100,
                totalAtEnd: Math.round(item.totalAtEnd * 100) / 100
            }))
        };

    } catch (error) {
        console.error('Error calculating interest:', error);
        throw error;
    }
}

/**
 * Calculate Simple Interest
 * @param {number} principal - Principal amount
 * @param {number} rate - Annual interest rate (as percentage)
 * @param {number} time - Time period in years
 * @returns {Object} Simple interest calculation result
 */
function calculateSimpleInterest(principal, rate, time) {
    const interest = (principal * rate * time) / 100;
    const totalAmount = principal + interest;

    return {
        interest,
        totalAmount
    };
}

/**
 * Calculate Compound Interest
 * @param {number} principal - Principal amount
 * @param {number} rate - Annual interest rate (as percentage)
 * @param {number} time - Time period in years
 * @returns {Object} Compound interest calculation result
 */
function calculateCompoundInterest(principal, rate, time) {
    const amount = principal * Math.pow(1 + rate / 100, time);
    const interest = amount - principal;
    const totalAmount = amount;

    return {
        interest,
        totalAmount
    };
}

/**
 * Generate year-wise breakdown
 * @param {number} principal - Principal amount
 * @param {number} rate - Annual interest rate (as percentage)
 * @param {number} time - Time period in years
 * @param {string} interestType - 'simple' or 'compound'
 * @returns {Array<Object>} Year-wise breakdown array
 */
function generateYearWiseBreakdown(principal, rate, time, interestType) {
    const breakdown = [];
    const roundedTime = Math.ceil(time);

    if (interestType === 'simple') {
        const yearlyInterest = (principal * rate) / 100;

        for (let year = 1; year <= roundedTime; year++) {
            const isPartialYear = year > time;
            const actualYear = isPartialYear ? time : year;
            const interestForYear = isPartialYear 
                ? (yearlyInterest * (time - Math.floor(time))) 
                : yearlyInterest;
            const totalAtEnd = principal + (yearlyInterest * actualYear);

            breakdown.push({
                year: isPartialYear ? time : year,
                principalAtStart: principal,
                interestForYear: interestForYear,
                totalAtEnd: totalAtEnd
            });

            if (year === Math.floor(time)) break;
        }
    } else {
        // Compound interest
        let runningPrincipal = principal;

        for (let year = 1; year <= roundedTime; year++) {
            const isPartialYear = year > time;
            const actualYear = isPartialYear ? (time - Math.floor(time)) : 1;
            const principalAtStart = runningPrincipal;
            const interestForYear = runningPrincipal * (Math.pow(1 + rate / 100, actualYear) - 1);
            const totalAtEnd = principalAtStart + interestForYear;

            breakdown.push({
                year: isPartialYear ? time : year,
                principalAtStart: principalAtStart,
                interestForYear: interestForYear,
                totalAtEnd: totalAtEnd
            });

            runningPrincipal = totalAtEnd;

            if (year === Math.floor(time)) break;
        }
    }

    return breakdown;
}

/**
 * Validate input parameters
 * @param {number} principal - Principal amount
 * @param {number} interestRate - Annual interest rate
 * @param {number} timePeriod - Time period in years
 * @param {string} interestType - Interest type ('simple' or 'compound')
 * @throws {Error} If validation fails
 */
function validateInputs(principal, interestRate, timePeriod, interestType) {
    if (!principal || principal <= 0) {
        throw new Error('Principal amount must be greater than 0');
    }

    if (interestRate < 0 || interestRate > 100) {
        throw new Error('Interest rate must be between 0 and 100');
    }

    if (!timePeriod || timePeriod <= 0 || timePeriod > 100) {
        throw new Error('Time period must be between 0.1 and 100 years');
    }

    if (!interestType || !['simple', 'compound'].includes(interestType)) {
        throw new Error('Interest type must be "simple" or "compound"');
    }
}

module.exports = {
    calculateInterest,
    calculateSimpleInterest,
    calculateCompoundInterest,
    generateYearWiseBreakdown,
    validateInputs
};

