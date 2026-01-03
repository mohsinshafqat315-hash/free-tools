/**
 * Loan Eligibility Calculator Controller
 * 
 * This controller handles loan eligibility calculation functionality
 * 
 * Functions:
 * - calculateLoanEligibility(monthlyIncome, emiCapacity, interestRate, loanTenure) - Calculate eligible loan amount
 * - calculateLoanAmountFromEMI(emi, monthlyRate, months) - Calculate loan amount using reverse EMI formula
 * - validateInputs(monthlyIncome, emiCapacity, interestRate, loanTenure) - Validate input parameters
 */

/**
 * Calculate Loan Eligibility
 * @param {number} monthlyIncome - Monthly income
 * @param {number} emiCapacity - Maximum EMI capacity per month
 * @param {number} interestRate - Annual interest rate (as percentage)
 * @param {number} loanTenure - Loan tenure in years
 * @returns {Promise<Object>} Loan eligibility calculation results
 */
async function calculateLoanEligibility(monthlyIncome, emiCapacity, interestRate, loanTenure) {
    try {
        // Validate inputs
        validateInputs(monthlyIncome, emiCapacity, interestRate, loanTenure);

        // Calculate eligible loan amount using reverse EMI formula
        const months = loanTenure * 12;
        const eligibleLoanAmount = calculateLoanAmountFromEMI(emiCapacity, interestRate, months);

        // Calculate total interest payable (approximate)
        const monthlyROI = interestRate / 12 / 100;
        let totalInterestPayable = 0;
        
        if (monthlyROI > 0) {
            // Approximate calculation: Total payable - Loan amount
            const totalPayableAmount = emiCapacity * months;
            totalInterestPayable = totalPayableAmount - eligibleLoanAmount;
        }

        const totalAmountPayable = eligibleLoanAmount + totalInterestPayable;
        const emiCapacityPercentage = (emiCapacity / monthlyIncome) * 100;

        return {
            monthlyIncome,
            emiCapacity,
            emiCapacityPercentage: Math.round(emiCapacityPercentage * 100) / 100,
            interestRate,
            loanTenure,
            eligibleLoanAmount: Math.round(eligibleLoanAmount * 100) / 100,
            maximumEMI: emiCapacity,
            totalInterestPayable: Math.round(totalInterestPayable * 100) / 100,
            totalAmountPayable: Math.round(totalAmountPayable * 100) / 100,
            eligibilityDetails: {
                incomeMultiplier: Math.round((eligibleLoanAmount / monthlyIncome) * 100) / 100,
                debtToIncomeRatio: Math.round(emiCapacityPercentage * 100) / 100
            }
        };

    } catch (error) {
        console.error('Error calculating loan eligibility:', error);
        throw error;
    }
}

/**
 * Calculate Loan Amount from EMI (Reverse EMI Formula)
 * Formula: Loan Amount = EMI × [(1 + r)^n - 1] / [r × (1 + r)^n]
 * @param {number} emi - Monthly EMI capacity
 * @param {number} annualROI - Annual ROI (as percentage)
 * @param {number} months - Number of months
 * @returns {number} Eligible loan amount
 */
function calculateLoanAmountFromEMI(emi, annualROI, months) {
    const monthlyRate = annualROI / 12 / 100;

    if (monthlyRate === 0) {
        // If ROI is 0, simply multiply EMI by months
        return emi * months;
    }

    const factor = Math.pow(1 + monthlyRate, months);
    const loanAmount = emi * ((factor - 1) / (monthlyRate * factor));

    return loanAmount;
}

/**
 * Validate Input Parameters
 * @param {number} monthlyIncome - Monthly income
 * @param {number} emiCapacity - EMI capacity
 * @param {number} interestRate - Interest rate
 * @param {number} loanTenure - Loan tenure
 * @throws {Error} If validation fails
 */
function validateInputs(monthlyIncome, emiCapacity, interestRate, loanTenure) {
    if (!monthlyIncome || monthlyIncome < 10000) {
        throw new Error('Monthly income must be at least ₹10,000');
    }

    if (!emiCapacity || emiCapacity < 1000) {
        throw new Error('EMI capacity must be at least ₹1,000');
    }

    if (emiCapacity >= monthlyIncome) {
        throw new Error('EMI capacity must be less than monthly income');
    }

    if (emiCapacity > monthlyIncome * 0.8) {
        throw new Error('EMI capacity should not exceed 80% of monthly income');
    }

    if (!interestRate || interestRate < 1 || interestRate > 30) {
        throw new Error('Interest rate must be between 1% and 30%');
    }

    if (!loanTenure || loanTenure < 1 || loanTenure > 30) {
        throw new Error('Loan tenure must be between 1 and 30 years');
    }
}

module.exports = {
    calculateLoanEligibility,
    calculateLoanAmountFromEMI,
    validateInputs
};

