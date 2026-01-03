/**
 * Budget Planner Controller
 * 
 * This controller handles budget planning and calculation functionality
 * 
 * Functions:
 * - calculateBudget(income, expenses) - Calculate budget summary and breakdown
 * - calculateSavings(income, totalExpenses) - Calculate savings/deficit
 * - calculatePercentages(expenses, totalExpenses) - Calculate category percentages
 * - validateBudgetInputs(income, expenses) - Validate input parameters
 */

/**
 * Calculate Budget
 * @param {number} income - Monthly income
 * @param {Array<Object>} expenses - Array of expense objects {category: string, amount: number}
 * @returns {Promise<Object>} Budget calculation results with breakdown
 */
async function calculateBudget(income, expenses) {
    try {
        // Validate inputs
        validateBudgetInputs(income, expenses);

        // Calculate total expenses
        const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

        // Calculate savings (positive = savings, negative = deficit)
        const savings = income - totalExpenses;
        const savingsPercentage = income > 0 ? (savings / income) * 100 : 0;

        // Calculate percentage for each expense category
        const expensesWithPercentage = expenses
            .filter(exp => exp.amount > 0)
            .map(exp => ({
                category: exp.category || 'Uncategorized',
                amount: exp.amount,
                percentage: totalExpenses > 0 ? (exp.amount / totalExpenses) * 100 : 0
            }))
            .sort((a, b) => b.amount - a.amount); // Sort by amount (descending)

        // Prepare chart data
        const chartData = expensesWithPercentage.map(exp => ({
            category: exp.category,
            value: exp.amount,
            percentage: exp.percentage
        }));

        // Round values to 2 decimal places
        const totalExpensesRounded = Math.round(totalExpenses * 100) / 100;
        const savingsRounded = Math.round(savings * 100) / 100;
        const savingsPercentageRounded = Math.round(savingsPercentage * 100) / 100;

        return {
            income,
            expenses: expensesWithPercentage.map(exp => ({
                category: exp.category,
                amount: Math.round(exp.amount * 100) / 100,
                percentage: Math.round(exp.percentage * 100) / 100
            })),
            totalExpenses: totalExpensesRounded,
            savings: savingsRounded,
            savingsPercentage: savingsPercentageRounded,
            breakdown: {
                byCategory: expensesWithPercentage.map(exp => ({
                    category: exp.category,
                    amount: Math.round(exp.amount * 100) / 100,
                    percentage: Math.round(exp.percentage * 100) / 100
                })),
                chartData: chartData.map(item => ({
                    category: item.category,
                    value: Math.round(item.value * 100) / 100,
                    percentage: Math.round(item.percentage * 100) / 100
                }))
            }
        };

    } catch (error) {
        console.error('Error calculating budget:', error);
        throw error;
    }
}

/**
 * Calculate Savings
 * @param {number} income - Monthly income
 * @param {number} totalExpenses - Total expenses
 * @returns {Object} Savings calculation result
 */
function calculateSavings(income, totalExpenses) {
    const savings = income - totalExpenses;
    const savingsPercentage = income > 0 ? (savings / income) * 100 : 0;

    return {
        savings: Math.round(savings * 100) / 100,
        savingsPercentage: Math.round(savingsPercentage * 100) / 100,
        isDeficit: savings < 0
    };
}

/**
 * Calculate Percentages for Expense Categories
 * @param {Array<Object>} expenses - Array of expense objects
 * @param {number} totalExpenses - Total expenses amount
 * @returns {Array<Object>} Expenses with percentage calculations
 */
function calculatePercentages(expenses, totalExpenses) {
    return expenses
        .filter(exp => exp.amount > 0)
        .map(exp => ({
            category: exp.category || 'Uncategorized',
            amount: exp.amount,
            percentage: totalExpenses > 0 ? (exp.amount / totalExpenses) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount)
        .map(exp => ({
            category: exp.category,
            amount: Math.round(exp.amount * 100) / 100,
            percentage: Math.round(exp.percentage * 100) / 100
        }));
}

/**
 * Validate Budget Input Parameters
 * @param {number} income - Monthly income
 * @param {Array<Object>} expenses - Array of expense objects
 * @throws {Error} If validation fails
 */
function validateBudgetInputs(income, expenses) {
    if (!income || income <= 0) {
        throw new Error('Income must be greater than 0');
    }

    if (!expenses || !Array.isArray(expenses)) {
        throw new Error('Expenses must be an array');
    }

    expenses.forEach((exp, index) => {
        if (!exp.category || typeof exp.category !== 'string') {
            throw new Error(`Expense at index ${index} must have a valid category`);
        }

        if (exp.amount < 0) {
            throw new Error(`Expense amount at index ${index} cannot be negative`);
        }
    });
}

module.exports = {
    calculateBudget,
    calculateSavings,
    calculatePercentages,
    validateBudgetInputs
};

