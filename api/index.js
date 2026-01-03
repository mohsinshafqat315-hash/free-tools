/**
 * Vercel Serverless Function Entry Point
 * This exports the Express app for Vercel deployment
 */

const app = require('../server');

// Export as serverless function for Vercel
// Vercel will call this function with (req, res) parameters
module.exports = (req, res) => {
    return app(req, res);
};

