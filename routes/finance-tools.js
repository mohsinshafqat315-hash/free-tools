/**
 * Finance Tools Routes
 * 
 * This file contains all routes for Finance Tools category
 * 
 * Routes:
 * - POST /api/tools/finance/emi-calculator/calculate - Calculate EMI
 * - POST /api/tools/finance/interest-calculator/calculate - Calculate Simple/Compound Interest
 * - POST /api/tools/finance/budget-planner/calculate - Calculate budget and savings
 * - POST /api/tools/finance/currency-converter/convert - Convert currency
 * - POST /api/tools/finance/income-tax-calculator/calculate - Calculate income tax
 * - POST /api/tools/finance/retirement-corpus-calculator/calculate - Calculate retirement corpus
 * - POST /api/tools/finance/sip-calculator/calculate - Calculate SIP returns
 * - POST /api/tools/finance/loan-eligibility-calculator/calculate - Calculate loan eligibility
 */

const express = require('express');
const router = express.Router();

// TODO: Import controllers when created
// const emiCalculatorController = require('../controllers/emiCalculatorController');
// const interestCalculatorController = require('../controllers/interestCalculatorController');
// const budgetPlannerController = require('../controllers/budgetPlannerController');
// const currencyConverterController = require('../controllers/currencyConverterController');
// const incomeTaxCalculatorController = require('../controllers/incomeTaxCalculatorController');
// const retirementCorpusCalculatorController = require('../controllers/retirementCorpusCalculatorController');
// const sipCalculatorController = require('../controllers/sipCalculatorController');
// const loanEligibilityCalculatorController = require('../controllers/loanEligibilityCalculatorController');

/**
 * EMI Calculator Route
 * POST /api/tools/finance/emi-calculator/calculate
 * 
 * Request Body:
 * {
 *   loanAmount: number,
 *   interestRate: number (annual percentage),
 *   tenureMonths: number (loan tenure in months)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     loanAmount: number,
 *     interestRate: number,
 *     tenureMonths: number,
 *     monthlyEMI: number,
 *     totalInterest: number,
 *     totalPayable: number,
 *     amortizationSchedule?: Array<{
 *       month: number,
 *       principal: number,
 *       interest: number,
 *       balance: number
 *     }>
 *   },
 *   error?: string
 * }
 */
router.post('/emi-calculator/calculate', async (req, res) => {
    try {
        const { loanAmount, interestRate, tenureMonths } = req.body;

        // Validation
        if (!loanAmount || loanAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Loan amount must be greater than 0'
            });
        }

        if (!interestRate || interestRate < 0 || interestRate > 100) {
            return res.status(400).json({
                success: false,
                error: 'Interest rate must be between 0 and 100'
            });
        }

        if (!tenureMonths || tenureMonths <= 0 || !Number.isInteger(tenureMonths)) {
            return res.status(400).json({
                success: false,
                error: 'Loan tenure must be a positive integer (in months)'
            });
        }

        // TODO: Implement EMI calculation logic
        // This is a placeholder - actual implementation needed
        // The calculator should:
        // 1. Calculate monthly EMI using formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
        //    Where: P = Principal, R = Monthly Interest Rate, N = Number of months
        // 2. Calculate total interest: (EMI × N) - P
        // 3. Calculate total payable: EMI × N
        // 4. Optionally generate amortization schedule
        // Note: Frontend can also perform this calculation, but backend provides:
        // - Validation and sanitization
        // - Consistent calculation logic
        // - Amortization schedule generation
        // - Export capabilities (PDF, CSV)

        // Placeholder calculation (basic implementation)
        const monthlyRate = interestRate / (12 * 100);
        let monthlyEMI;
        
        if (monthlyRate === 0) {
            monthlyEMI = loanAmount / tenureMonths;
        } else {
            const factor = Math.pow(1 + monthlyRate, tenureMonths);
            monthlyEMI = (loanAmount * monthlyRate * factor) / (factor - 1);
        }

        const totalPayable = monthlyEMI * tenureMonths;
        const totalInterest = totalPayable - loanAmount;

        const mockData = {
            loanAmount,
            interestRate,
            tenureMonths,
            monthlyEMI: Math.round(monthlyEMI * 100) / 100, // Round to 2 decimal places
            totalInterest: Math.round(totalInterest * 100) / 100,
            totalPayable: Math.round(totalPayable * 100) / 100
            // amortizationSchedule: [] // TODO: Generate if requested
        };

        // TODO: Replace with actual implementation
        // const calculationData = await emiCalculatorController.calculateEMI(loanAmount, interestRate, tenureMonths);

        res.json({
            success: true,
            data: mockData
        });

    } catch (error) {
        console.error('EMI calculator error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

/**
 * Interest Calculator Route
 * POST /api/tools/finance/interest-calculator/calculate
 * 
 * Request Body:
 * {
 *   principal: number,
 *   interestRate: number (annual percentage),
 *   timePeriod: number (in years),
 *   interestType: 'simple' | 'compound'
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     principal: number,
 *     interestRate: number,
 *     timePeriod: number,
 *     interestType: 'simple' | 'compound',
 *     interestAmount: number,
 *     totalAmount: number,
 *     growthRate: number,
 *     yearWiseBreakdown: Array<{
 *       year: number,
 *       principalAtStart: number,
 *       interestForYear: number,
 *       totalAtEnd: number
 *     }>
 *   },
 *   error?: string
 * }
 */
router.post('/interest-calculator/calculate', async (req, res) => {
    try {
        const { principal, interestRate, timePeriod, interestType } = req.body;

        // Validation
        if (!principal || principal <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Principal amount must be greater than 0'
            });
        }

        if (!interestRate || interestRate < 0 || interestRate > 100) {
            return res.status(400).json({
                success: false,
                error: 'Interest rate must be between 0 and 100'
            });
        }

        if (!timePeriod || timePeriod <= 0 || timePeriod > 100) {
            return res.status(400).json({
                success: false,
                error: 'Time period must be between 0.1 and 100 years'
            });
        }

        if (!interestType || !['simple', 'compound'].includes(interestType)) {
            return res.status(400).json({
                success: false,
                error: 'Interest type must be "simple" or "compound"'
            });
        }

        // TODO: Implement interest calculation logic
        // This is a placeholder - actual implementation needed
        // The calculator should:
        // 1. Calculate simple interest: SI = (P × R × T) / 100
        // 2. Calculate compound interest: CI = P × (1 + R/100)^T - P
        // 3. Generate year-wise breakdown
        // 4. Calculate growth rate
        // Note: Frontend can also perform this calculation, but backend provides:
        // - Validation and sanitization
        // - Consistent calculation logic
        // - Advanced breakdown generation
        // - Export capabilities (PDF, CSV)

        // Placeholder calculation (basic implementation)
        let interestAmount, totalAmount;
        
        if (interestType === 'simple') {
            interestAmount = (principal * interestRate * timePeriod) / 100;
            totalAmount = principal + interestAmount;
        } else {
            // Compound interest
            totalAmount = principal * Math.pow(1 + interestRate / 100, timePeriod);
            interestAmount = totalAmount - principal;
        }

        const growthRate = (interestAmount / principal) * 100;

        // Generate year-wise breakdown (simplified - full implementation in controller)
        const yearWiseBreakdown = [];
        const roundedTime = Math.ceil(timePeriod);
        
        if (interestType === 'simple') {
            const yearlyInterest = (principal * interestRate) / 100;
            for (let year = 1; year <= roundedTime; year++) {
                const actualYear = year > timePeriod ? timePeriod : year;
                yearWiseBreakdown.push({
                    year: actualYear,
                    principalAtStart: principal,
                    interestForYear: year > timePeriod ? (yearlyInterest * (timePeriod - Math.floor(timePeriod))) : yearlyInterest,
                    totalAtEnd: principal + (yearlyInterest * actualYear)
                });
                if (year === Math.floor(timePeriod)) break;
            }
        } else {
            // Compound interest breakdown
            let runningPrincipal = principal;
            for (let year = 1; year <= roundedTime; year++) {
                const actualYear = year > timePeriod ? (timePeriod - Math.floor(timePeriod)) : 1;
                const principalAtStart = runningPrincipal;
                const interestForYear = runningPrincipal * (Math.pow(1 + interestRate / 100, actualYear) - 1);
                const totalAtEnd = principalAtStart + interestForYear;
                yearWiseBreakdown.push({
                    year: year > timePeriod ? timePeriod : year,
                    principalAtStart: principalAtStart,
                    interestForYear: interestForYear,
                    totalAtEnd: totalAtEnd
                });
                runningPrincipal = totalAtEnd;
                if (year === Math.floor(timePeriod)) break;
            }
        }

        const mockData = {
            principal,
            interestRate,
            timePeriod,
            interestType,
            interestAmount: Math.round(interestAmount * 100) / 100,
            totalAmount: Math.round(totalAmount * 100) / 100,
            growthRate: Math.round(growthRate * 100) / 100,
            yearWiseBreakdown: yearWiseBreakdown.map(item => ({
                year: item.year,
                principalAtStart: Math.round(item.principalAtStart * 100) / 100,
                interestForYear: Math.round(item.interestForYear * 100) / 100,
                totalAtEnd: Math.round(item.totalAtEnd * 100) / 100
            }))
        };

        // TODO: Replace with actual implementation
        // const calculationData = await interestCalculatorController.calculateInterest(principal, interestRate, timePeriod, interestType);

        res.json({
            success: true,
            data: mockData
        });

    } catch (error) {
        console.error('Interest calculator error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

/**
 * Budget Planner Route
 * POST /api/tools/finance/budget-planner/calculate
 * 
 * Request Body:
 * {
 *   income: number,
 *   expenses: Array<{
 *     category: string,
 *     amount: number
 *   }>
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     income: number,
 *     expenses: Array<{
 *       category: string,
 *       amount: number,
 *       percentage: number
 *     }>,
 *     totalExpenses: number,
 *     savings: number, // positive = savings, negative = deficit
 *     savingsPercentage: number,
 *     breakdown: {
 *       byCategory: Array<{
 *         category: string,
 *         amount: number,
 *         percentage: number
 *       }>,
 *       chartData: Array<{
 *         category: string,
 *         value: number,
 *         percentage: number
 *       }>
 *     }
 *   },
 *   error?: string
 * }
 */
router.post('/budget-planner/calculate', async (req, res) => {
    try {
        const { income, expenses } = req.body;

        // Validation
        if (!income || income <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Income must be greater than 0'
            });
        }

        if (!expenses || !Array.isArray(expenses)) {
            return res.status(400).json({
                success: false,
                error: 'Expenses must be an array'
            });
        }

        // TODO: Implement budget calculation logic
        // This is a placeholder - actual implementation needed
        // The calculator should:
        // 1. Calculate total expenses from expense array
        // 2. Calculate savings (income - total expenses)
        // 3. Calculate savings percentage
        // 4. Calculate percentage for each expense category
        // 5. Sort expenses by amount
        // 6. Prepare chart data for visualization
        // Note: Frontend can also perform this calculation, but backend provides:
        // - Validation and sanitization
        // - Consistent calculation logic
        // - Advanced analytics
        // - Export capabilities (PDF, CSV)

        // Placeholder calculation (basic implementation)
        const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        const savings = income - totalExpenses;
        const savingsPercentage = (savings / income) * 100;

        // Calculate percentage for each expense category
        const expensesWithPercentage = expenses
            .filter(exp => exp.amount > 0)
            .map(exp => ({
                category: exp.category || 'Uncategorized',
                amount: exp.amount,
                percentage: totalExpenses > 0 ? (exp.amount / totalExpenses) * 100 : 0
            }))
            .sort((a, b) => b.amount - a.amount);

        const mockData = {
            income,
            expenses: expensesWithPercentage.map(exp => ({
                category: exp.category,
                amount: Math.round(exp.amount * 100) / 100,
                percentage: Math.round(exp.percentage * 100) / 100
            })),
            totalExpenses: Math.round(totalExpenses * 100) / 100,
            savings: Math.round(savings * 100) / 100,
            savingsPercentage: Math.round(savingsPercentage * 100) / 100,
            breakdown: {
                byCategory: expensesWithPercentage.map(exp => ({
                    category: exp.category,
                    amount: Math.round(exp.amount * 100) / 100,
                    percentage: Math.round(exp.percentage * 100) / 100
                })),
                chartData: expensesWithPercentage.map(exp => ({
                    category: exp.category,
                    value: Math.round(exp.amount * 100) / 100,
                    percentage: Math.round(exp.percentage * 100) / 100
                }))
            }
        };

        // TODO: Replace with actual implementation
        // const budgetData = await budgetPlannerController.calculateBudget(income, expenses);

        res.json({
            success: true,
            data: mockData
        });

    } catch (error) {
        console.error('Budget planner error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

/**
 * Currency Converter Route
 * POST /api/tools/finance/currency-converter/convert
 * 
 * Request Body:
 * {
 *   amount: number,
 *   fromCurrency: string (currency code, e.g., "USD", "EUR", "INR"),
 *   toCurrency: string (currency code)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     amount: number,
 *     fromCurrency: string,
 *     toCurrency: string,
 *     exchangeRate: number,
 *     convertedAmount: number,
 *     conversionDate: string,
 *     lastUpdated: string
 *   },
 *   error?: string
 * }
 */
router.post('/currency-converter/convert', async (req, res) => {
    try {
        const { amount, fromCurrency, toCurrency } = req.body;

        // Validation
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Amount must be greater than 0'
            });
        }

        if (!fromCurrency || !toCurrency) {
            return res.status(400).json({
                success: false,
                error: 'Both fromCurrency and toCurrency are required'
            });
        }

        if (fromCurrency === toCurrency) {
            return res.status(400).json({
                success: false,
                error: 'From and to currencies must be different'
            });
        }

        // Valid currency codes (major currencies)
        const validCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD', 'HKD', 'NZD', 'KRW', 'BRL', 'MXN', 'ZAR', 'RUB', 'AED', 'SAR', 'THB'];
        
        if (!validCurrencies.includes(fromCurrency) || !validCurrencies.includes(toCurrency)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid currency code'
            });
        }

        // TODO: Implement currency conversion logic
        // This is a placeholder - actual implementation needed
        // The converter should:
        // 1. Fetch real-time exchange rates from a currency API (e.g., ExchangeRate-API, Fixer.io, Open Exchange Rates)
        // 2. Calculate converted amount: convertedAmount = amount × exchangeRate
        // 3. Return conversion result with rate and date
        // Options:
        // - Use free tier APIs (ExchangeRate-API, CurrencyAPI)
        // - Use paid APIs for more reliable data (Fixer.io, Open Exchange Rates)
        // - Cache rates for performance
        // - Handle API errors gracefully

        // Placeholder conversion (using mock exchange rate)
        // In production, this should fetch real exchange rates
        const mockExchangeRates = {
            'USD': { 'EUR': 0.92, 'GBP': 0.79, 'INR': 83.50, 'JPY': 149.50 },
            'EUR': { 'USD': 1.09, 'GBP': 0.86, 'INR': 90.75, 'JPY': 162.50 },
            'INR': { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'JPY': 1.79 },
            // Add more rates as needed
        };

        // Get exchange rate (fallback to 1 if not in mock data)
        let exchangeRate = 1;
        if (mockExchangeRates[fromCurrency] && mockExchangeRates[fromCurrency][toCurrency]) {
            exchangeRate = mockExchangeRates[fromCurrency][toCurrency];
        } else if (mockExchangeRates[toCurrency] && mockExchangeRates[toCurrency][fromCurrency]) {
            exchangeRate = 1 / mockExchangeRates[toCurrency][fromCurrency];
        }

        const convertedAmount = amount * exchangeRate;
        const now = new Date().toISOString();

        const mockData = {
            amount,
            fromCurrency,
            toCurrency,
            exchangeRate: Math.round(exchangeRate * 100000) / 100000, // Round to 5 decimal places
            convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
            conversionDate: now,
            lastUpdated: now
        };

        // TODO: Replace with actual implementation
        // const conversionData = await currencyConverterController.convertCurrency(amount, fromCurrency, toCurrency);

        res.json({
            success: true,
            data: mockData
        });

    } catch (error) {
        console.error('Currency converter error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

/**
 * Income Tax Calculator Route
 * POST /api/tools/finance/income-tax-calculator/calculate
 * 
 * Request Body:
 * {
 *   annualIncome: number,
 *   age: string ('below-60' | '60-80' | 'above-80'),
 *   deductions: {
 *     section80C: number,
 *     section80D: number,
 *     hra: number,
 *     section80G: number,
 *     other: number
 *   }
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     annualIncome: number,
 *     age: string,
 *     deductions: object,
 *     totalDeductions: number,
 *     taxableIncome: number,
 *     taxSlabs: Array<{
 *       slab: string,
 *       income: number,
 *       rate: number,
 *       tax: number
 *     }>,
 *     incomeTax: number,
 *     cess: number,
 *     totalTaxPayable: number,
 *     effectiveTaxRate: number,
 *     afterTaxIncome: number
 *   },
 *   error?: string
 * }
 */
router.post('/income-tax-calculator/calculate', async (req, res) => {
    try {
        const { annualIncome, age, deductions } = req.body;

        // Validation
        if (!annualIncome || annualIncome < 0) {
            return res.status(400).json({
                success: false,
                error: 'Annual income must be greater than or equal to 0'
            });
        }

        if (!age || !['below-60', '60-80', 'above-80'].includes(age)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid age category'
            });
        }

        if (!deductions || typeof deductions !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Deductions must be an object'
            });
        }

        // TODO: Implement income tax calculation logic
        // This is a placeholder - actual implementation needed
        // The calculator should:
        // 1. Calculate total deductions from deduction object
        // 2. Calculate taxable income: annualIncome - totalDeductions
        // 3. Apply tax slabs based on age category
        // 4. Calculate tax for each slab
        // 5. Calculate cess (typically 4% of income tax)
        // 6. Calculate total tax payable
        // 7. Calculate effective tax rate
        // 8. Calculate after-tax income
        // Note: Tax slabs vary by country and change annually
        // This implementation should be updated based on current tax laws

        // Placeholder calculation (simplified India tax slabs)
        const totalDeductions = (deductions.section80C || 0) + 
                               (deductions.section80D || 0) + 
                               (deductions.hra || 0) + 
                               (deductions.section80G || 0) + 
                               (deductions.other || 0);

        const taxableIncome = Math.max(0, annualIncome - totalDeductions);

        // Get tax slabs based on age (simplified)
        let taxSlabs = [];
        if (age === 'below-60') {
            taxSlabs = [
                { min: 0, max: 250000, rate: 0 },
                { min: 250000, max: 500000, rate: 5 },
                { min: 500000, max: 1000000, rate: 20 },
                { min: 1000000, max: Infinity, rate: 30 }
            ];
        } else if (age === '60-80') {
            taxSlabs = [
                { min: 0, max: 300000, rate: 0 },
                { min: 300000, max: 500000, rate: 5 },
                { min: 500000, max: 1000000, rate: 20 },
                { min: 1000000, max: Infinity, rate: 30 }
            ];
        } else {
            taxSlabs = [
                { min: 0, max: 500000, rate: 0 },
                { min: 500000, max: 1000000, rate: 20 },
                { min: 1000000, max: Infinity, rate: 30 }
            ];
        }

        // Calculate tax by slabs
        let incomeTax = 0;
        const taxBreakdown = [];
        for (const slab of taxSlabs) {
            if (taxableIncome <= slab.min) break;
            const slabIncome = Math.min(taxableIncome - slab.min, slab.max === Infinity ? taxableIncome : slab.max - slab.min);
            if (slabIncome <= 0) continue;
            const slabTax = (slabIncome * slab.rate) / 100;
            incomeTax += slabTax;
            taxBreakdown.push({
                slab: `₹${Math.round(slab.min / 1000)}k - ${slab.max === Infinity ? 'Above' : `₹${Math.round(slab.max / 1000)}k`}`,
                income: Math.round(slabIncome * 100) / 100,
                rate: slab.rate,
                tax: Math.round(slabTax * 100) / 100
            });
        }

        // Calculate cess (4%)
        const cess = Math.round((incomeTax * 4) / 100 * 100) / 100;
        const totalTaxPayable = Math.round((incomeTax + cess) * 100) / 100;
        const effectiveTaxRate = annualIncome > 0 ? Math.round((totalTaxPayable / annualIncome) * 100 * 100) / 100 : 0;
        const afterTaxIncome = Math.round((annualIncome - totalTaxPayable) * 100) / 100;

        const mockData = {
            annualIncome,
            age,
            deductions,
            totalDeductions: Math.round(totalDeductions * 100) / 100,
            taxableIncome: Math.round(taxableIncome * 100) / 100,
            taxSlabs: taxBreakdown,
            incomeTax: Math.round(incomeTax * 100) / 100,
            cess,
            totalTaxPayable,
            effectiveTaxRate,
            afterTaxIncome
        };

        // TODO: Replace with actual implementation
        // const taxData = await incomeTaxCalculatorController.calculateTax(annualIncome, age, deductions);

        res.json({
            success: true,
            data: mockData
        });

    } catch (error) {
        console.error('Income tax calculator error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

/**
 * SIP Calculator Route
 * POST /api/tools/finance/sip-calculator/calculate
 * 
 * Request Body:
 * {
 *   monthlyInvestment: number,
 *   investmentPeriod: number (years),
 *   expectedROI: number (annual percentage)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     monthlyInvestment: number,
 *     investmentPeriod: number,
 *     expectedROI: number,
 *     totalInvestment: number,
 *     estimatedReturns: number,
 *     totalValue: number,
 *     returnsPercentage: number,
 *     yearWiseGrowth: Array<{
 *       year: number,
 *       totalInvestment: number,
 *       estimatedReturns: number,
 *       totalValue: number
 *     }>
 *   },
 *   error?: string
 * }
 */
router.post('/sip-calculator/calculate', async (req, res) => {
    try {
        const { monthlyInvestment, investmentPeriod, expectedROI } = req.body;

        // Validation
        if (!monthlyInvestment || monthlyInvestment < 500) {
            return res.status(400).json({
                success: false,
                error: 'Monthly investment must be at least ₹500'
            });
        }

        if (!investmentPeriod || investmentPeriod < 1 || investmentPeriod > 50) {
            return res.status(400).json({
                success: false,
                error: 'Investment period must be between 1 and 50 years'
            });
        }

        if (!expectedROI || expectedROI < 1 || expectedROI > 20) {
            return res.status(400).json({
                success: false,
                error: 'Expected ROI must be between 1% and 20%'
            });
        }

        // TODO: Implement SIP calculation logic
        // This is a placeholder - actual implementation needed
        // The calculator should:
        // 1. Calculate total investment (monthlyInvestment × months)
        // 2. Calculate SIP returns using Future Value of Annuity formula
        //    FV = PMT × [((1 + r)^n - 1) / r] × (1 + r)
        //    Where: PMT = Monthly Payment, r = Monthly ROI, n = Number of months
        // 3. Calculate estimated returns (totalValue - totalInvestment)
        // 4. Calculate returns percentage
        // 5. Generate year-wise growth data for chart/table visualization

        const months = investmentPeriod * 12;
        const monthlyROI = expectedROI / 12 / 100;
        const totalInvestmentAmount = monthlyInvestment * months;

        // Calculate SIP returns
        let totalValue;
        if (monthlyROI === 0) {
            totalValue = totalInvestmentAmount;
        } else {
            const factor = Math.pow(1 + monthlyROI, months);
            totalValue = monthlyInvestment * ((factor - 1) / monthlyROI) * (1 + monthlyROI);
        }

        const estimatedReturns = totalValue - totalInvestmentAmount;
        const returnsPercentage = totalInvestmentAmount > 0 ? (estimatedReturns / totalInvestmentAmount) * 100 : 0;

        // Generate year-wise growth
        const yearWiseGrowth = [];
        for (let year = 1; year <= investmentPeriod; year++) {
            const yearMonths = year * 12;
            const yearTotalInvestment = monthlyInvestment * yearMonths;
            let yearTotalValue;
            if (monthlyROI === 0) {
                yearTotalValue = yearTotalInvestment;
            } else {
                const yearFactor = Math.pow(1 + monthlyROI, yearMonths);
                yearTotalValue = monthlyInvestment * ((yearFactor - 1) / monthlyROI) * (1 + monthlyROI);
            }
            yearWiseGrowth.push({
                year,
                totalInvestment: Math.round(yearTotalInvestment * 100) / 100,
                estimatedReturns: Math.round((yearTotalValue - yearTotalInvestment) * 100) / 100,
                totalValue: Math.round(yearTotalValue * 100) / 100
            });
        }

        const mockData = {
            monthlyInvestment,
            investmentPeriod,
            expectedROI,
            totalInvestment: Math.round(totalInvestmentAmount * 100) / 100,
            estimatedReturns: Math.round(estimatedReturns * 100) / 100,
            totalValue: Math.round(totalValue * 100) / 100,
            returnsPercentage: Math.round(returnsPercentage * 100) / 100,
            yearWiseGrowth
        };

        // TODO: Replace with actual implementation
        // const sipData = await sipCalculatorController.calculateSIP(monthlyInvestment, investmentPeriod, expectedROI);

        res.json({
            success: true,
            data: mockData
        });

    } catch (error) {
        console.error('SIP calculator error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

/**
 * FD Calculator Route
 * POST /api/tools/finance/fd-calculator/calculate
 * 
 * Request Body:
 * {
 *   principal: number,
 *   interestRate: number (annual percentage),
 *   tenure: number (years)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     principal: number,
 *     interestRate: number,
 *     tenure: number,
 *     compoundingFrequency: number,
 *     maturityAmount: number,
 *     totalInterestEarned: number,
 *     effectiveRate: number
 *   },
 *   error?: string
 * }
 */
router.post('/fd-calculator/calculate', async (req, res) => {
    try {
        const { principal, interestRate, tenure } = req.body;

        // Validation
        if (!principal || principal < 1000) {
            return res.status(400).json({
                success: false,
                error: 'Principal amount must be at least ₹1,000'
            });
        }

        if (!interestRate || interestRate < 1 || interestRate > 15) {
            return res.status(400).json({
                success: false,
                error: 'Interest rate must be between 1% and 15%'
            });
        }

        if (!tenure || tenure <= 0 || tenure > 10) {
            return res.status(400).json({
                success: false,
                error: 'Tenure must be between 1 and 10 years'
            });
        }

        // TODO: Implement FD calculation logic
        // This is a placeholder - actual implementation needed
        // The calculator should:
        // 1. Calculate FD maturity using compound interest formula
        //    Maturity Amount = Principal × (1 + r/n)^(n×t)
        //    Where: r = Annual interest rate, n = Compounding frequency (quarterly = 4), t = Time in years
        // 2. Calculate total interest earned
        // 3. Calculate effective annual rate (EAR)
        // 4. Generate year-wise growth data for graph visualization

        const COMPOUNDING_FREQUENCY = 4; // Quarterly compounding
        const rateDecimal = interestRate / 100;
        const factor = Math.pow(1 + rateDecimal / COMPOUNDING_FREQUENCY, COMPOUNDING_FREQUENCY * tenure);
        const maturityAmount = principal * factor;
        const totalInterestEarned = maturityAmount - principal;
        
        // Calculate effective annual rate
        const effectiveRate = (Math.pow(1 + rateDecimal / COMPOUNDING_FREQUENCY, COMPOUNDING_FREQUENCY) - 1) * 100;

        const mockData = {
            principal,
            interestRate,
            tenure,
            compoundingFrequency: COMPOUNDING_FREQUENCY,
            maturityAmount: Math.round(maturityAmount * 100) / 100,
            totalInterestEarned: Math.round(totalInterestEarned * 100) / 100,
            effectiveRate: Math.round(effectiveRate * 100) / 100
        };

        // TODO: Replace with actual implementation
        // const fdData = await fdCalculatorController.calculateFD(principal, interestRate, tenure);

        res.json({
            success: true,
            data: mockData
        });

    } catch (error) {
        console.error('FD calculator error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

module.exports = router;

