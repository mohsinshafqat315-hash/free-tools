/**
 * Income Tax Calculator Controller
 * 
 * This controller handles income tax calculation functionality
 * 
 * Functions:
 * - calculateTax(annualIncome, age, deductions) - Calculate income tax
 * - getTaxSlabs(age) - Get tax slabs based on age category
 * - calculateTaxBySlabs(taxableIncome, slabs) - Calculate tax by applying slabs
 * - calculateDeductions(deductions) - Calculate total deductions
 * - validateInputs(annualIncome, age, deductions) - Validate input parameters
 */

/**
 * Calculate Income Tax
 * @param {number} annualIncome - Annual income
 * @param {string} age - Age category ('below-60' | '60-80' | 'above-80')
 * @param {Object} deductions - Deduction object
 * @returns {Promise<Object>} Tax calculation results
 */
async function calculateTax(annualIncome, age, deductions) {
    try {
        // Validate inputs
        validateInputs(annualIncome, age, deductions);

        // Calculate total deductions
        const totalDeductions = calculateDeductions(deductions);

        // Calculate taxable income
        const taxableIncome = Math.max(0, annualIncome - totalDeductions);

        // Get tax slabs based on age
        const taxSlabs = getTaxSlabs(age);

        // Calculate tax by slabs
        const { totalTax: incomeTax, taxBreakdown } = calculateTaxBySlabs(taxableIncome, taxSlabs);

        // Calculate cess (typically 4% of income tax)
        const cess = (incomeTax * 4) / 100;

        // Calculate total tax payable
        const totalTaxPayable = incomeTax + cess;

        // Calculate effective tax rate
        const effectiveTaxRate = annualIncome > 0 ? (totalTaxPayable / annualIncome) * 100 : 0;

        // Calculate after-tax income
        const afterTaxIncome = annualIncome - totalTaxPayable;

        // Round values
        return {
            annualIncome,
            age,
            deductions,
            totalDeductions: Math.round(totalDeductions * 100) / 100,
            taxableIncome: Math.round(taxableIncome * 100) / 100,
            taxSlabs: taxBreakdown.map(slab => ({
                slab: slab.slab,
                income: Math.round(slab.income * 100) / 100,
                rate: slab.rate,
                tax: Math.round(slab.tax * 100) / 100
            })),
            incomeTax: Math.round(incomeTax * 100) / 100,
            cess: Math.round(cess * 100) / 100,
            totalTaxPayable: Math.round(totalTaxPayable * 100) / 100,
            effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
            afterTaxIncome: Math.round(afterTaxIncome * 100) / 100
        };

    } catch (error) {
        console.error('Error calculating income tax:', error);
        throw error;
    }
}

/**
 * Get Tax Slabs Based on Age
 * @param {string} age - Age category
 * @returns {Array<Object>} Tax slabs array
 */
function getTaxSlabs(age) {
    // TODO: Update tax slabs based on current tax laws
    // Tax slabs vary by country and change annually
    // This is a simplified version - update with actual current tax slabs

    if (age === 'below-60') {
        return [
            { min: 0, max: 250000, rate: 0 },
            { min: 250000, max: 500000, rate: 5 },
            { min: 500000, max: 1000000, rate: 20 },
            { min: 1000000, max: Infinity, rate: 30 }
        ];
    } else if (age === '60-80') {
        return [
            { min: 0, max: 300000, rate: 0 },
            { min: 300000, max: 500000, rate: 5 },
            { min: 500000, max: 1000000, rate: 20 },
            { min: 1000000, max: Infinity, rate: 30 }
        ];
    } else { // above-80
        return [
            { min: 0, max: 500000, rate: 0 },
            { min: 500000, max: 1000000, rate: 20 },
            { min: 1000000, max: Infinity, rate: 30 }
        ];
    }
}

/**
 * Calculate Tax by Applying Slabs
 * @param {number} taxableIncome - Taxable income amount
 * @param {Array<Object>} slabs - Tax slabs array
 * @returns {Object} Tax calculation result with breakdown
 */
function calculateTaxBySlabs(taxableIncome, slabs) {
    let totalTax = 0;
    const taxBreakdown = [];

    for (const slab of slabs) {
        if (taxableIncome <= slab.min) break;

        const slabIncome = Math.min(taxableIncome - slab.min, slab.max === Infinity ? taxableIncome : slab.max - slab.min);
        if (slabIncome <= 0) continue;

        const slabTax = (slabIncome * slab.rate) / 100;
        totalTax += slabTax;

        taxBreakdown.push({
            slab: `₹${formatNumber(slab.min)} - ${slab.max === Infinity ? 'Above' : `₹${formatNumber(slab.max)}`}`,
            income: slabIncome,
            rate: slab.rate,
            tax: slabTax
        });
    }

    return { totalTax, taxBreakdown };
}

/**
 * Calculate Total Deductions
 * @param {Object} deductions - Deduction object
 * @returns {number} Total deductions amount
 */
function calculateDeductions(deductions) {
    const section80C = Math.min(deductions.section80C || 0, 150000); // Max ₹1.5 lakh
    const section80D = Math.min(deductions.section80D || 0, 100000); // Max varies
    const hra = deductions.hra || 0;
    const section80G = deductions.section80G || 0;
    const other = deductions.other || 0;

    return section80C + section80D + hra + section80G + other;
}

/**
 * Format Number for Display
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
}

/**
 * Validate Input Parameters
 * @param {number} annualIncome - Annual income
 * @param {string} age - Age category
 * @param {Object} deductions - Deduction object
 * @throws {Error} If validation fails
 */
function validateInputs(annualIncome, age, deductions) {
    if (!annualIncome || annualIncome < 0) {
        throw new Error('Annual income must be greater than or equal to 0');
    }

    if (!age || !['below-60', '60-80', 'above-80'].includes(age)) {
        throw new Error('Invalid age category');
    }

    if (!deductions || typeof deductions !== 'object') {
        throw new Error('Deductions must be an object');
    }

    // Validate deduction amounts are non-negative
    const deductionKeys = ['section80C', 'section80D', 'hra', 'section80G', 'other'];
    deductionKeys.forEach(key => {
        if (deductions[key] !== undefined && deductions[key] < 0) {
            throw new Error(`Deduction ${key} cannot be negative`);
        }
    });
}

module.exports = {
    calculateTax,
    getTaxSlabs,
    calculateTaxBySlabs,
    calculateDeductions,
    validateInputs
};

