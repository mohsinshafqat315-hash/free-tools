/**
 * EMI Calculator Controller
 * 
 * This controller handles EMI (Equated Monthly Installment) calculation functionality
 * 
 * Functions:
 * - calculateEMI(loanAmount, interestRate, tenureMonths) - Calculate EMI and totals
 * - generateAmortizationSchedule(loanAmount, interestRate, tenureMonths, monthlyEMI) - Generate amortization schedule
 * - validateInputs(loanAmount, interestRate, tenureMonths) - Validate input parameters
 */

/**
 * Calculate EMI (Equated Monthly Installment)
 * @param {number} loanAmount - Principal loan amount
 * @param {number} interestRate - Annual interest rate (as percentage, e.g., 8.5 for 8.5%)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {Promise<Object>} EMI calculation results
 */
async function calculateEMI(loanAmount, interestRate, tenureMonths) {
    try {
        // Validate inputs
        validateInputs(loanAmount, interestRate, tenureMonths);

        // Convert annual interest rate to monthly rate (as decimal)
        const monthlyRate = interestRate / (12 * 100);
        
        // Calculate EMI using standard formula
        // EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
        // Where: P = Principal, R = Monthly Interest Rate, N = Number of months
        let monthlyEMI;
        
        if (monthlyRate === 0) {
            // If interest rate is 0, EMI is simply principal divided by months
            monthlyEMI = loanAmount / tenureMonths;
        } else {
            const factor = Math.pow(1 + monthlyRate, tenureMonths);
            monthlyEMI = (loanAmount * monthlyRate * factor) / (factor - 1);
        }

        // Calculate totals
        const totalPayable = monthlyEMI * tenureMonths;
        const totalInterest = totalPayable - loanAmount;

        // Round to 2 decimal places
        monthlyEMI = Math.round(monthlyEMI * 100) / 100;
        const totalPayableRounded = Math.round(totalPayable * 100) / 100;
        const totalInterestRounded = Math.round(totalInterest * 100) / 100;

        return {
            loanAmount,
            interestRate,
            tenureMonths,
            monthlyEMI,
            totalInterest: totalInterestRounded,
            totalPayable: totalPayableRounded
        };

    } catch (error) {
        console.error('Error calculating EMI:', error);
        throw error;
    }
}

/**
 * Generate amortization schedule
 * @param {number} loanAmount - Principal loan amount
 * @param {number} interestRate - Annual interest rate (as percentage)
 * @param {number} tenureMonths - Loan tenure in months
 * @param {number} monthlyEMI - Monthly EMI amount
 * @returns {Array<Object>} Amortization schedule array
 */
function generateAmortizationSchedule(loanAmount, interestRate, tenureMonths, monthlyEMI) {
    // TODO: Implement amortization schedule generation
    // This function should generate a month-by-month breakdown showing:
    // - Month number
    // - Principal component of EMI
    // - Interest component of EMI
    // - Remaining balance
    
    const schedule = [];
    const monthlyRate = interestRate / (12 * 100);
    let balance = loanAmount;

    for (let month = 1; month <= tenureMonths; month++) {
        const interestComponent = balance * monthlyRate;
        const principalComponent = monthlyEMI - interestComponent;
        balance = balance - principalComponent;

        schedule.push({
            month,
            principal: Math.round(principalComponent * 100) / 100,
            interest: Math.round(interestComponent * 100) / 100,
            balance: Math.max(0, Math.round(balance * 100) / 100) // Ensure balance doesn't go negative
        });
    }

    return schedule;
}

/**
 * Validate input parameters
 * @param {number} loanAmount - Principal loan amount
 * @param {number} interestRate - Annual interest rate
 * @param {number} tenureMonths - Loan tenure in months
 * @throws {Error} If validation fails
 */
function validateInputs(loanAmount, interestRate, tenureMonths) {
    if (!loanAmount || loanAmount <= 0) {
        throw new Error('Loan amount must be greater than 0');
    }

    if (interestRate < 0 || interestRate > 100) {
        throw new Error('Interest rate must be between 0 and 100');
    }

    if (!tenureMonths || tenureMonths <= 0 || !Number.isInteger(tenureMonths)) {
        throw new Error('Loan tenure must be a positive integer (in months)');
    }
}

module.exports = {
    calculateEMI,
    generateAmortizationSchedule,
    validateInputs
};

