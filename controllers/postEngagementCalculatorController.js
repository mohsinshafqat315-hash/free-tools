/**
 * Post Engagement Calculator Controller
 * 
 * This controller handles engagement rate calculation functionality
 * 
 * Functions:
 * - calculateEngagementRate(likes, comments, shares, followers, platform) - Calculate engagement rate
 * - validateInputs(likes, comments, shares, followers) - Validate input values
 * - getBenchmark(platform) - Get platform-specific benchmarks
 */

/**
 * Calculate Engagement Rate
 * @param {number} likes - Number of likes
 * @param {number} comments - Number of comments
 * @param {number} shares - Number of shares
 * @param {number} followers - Number of followers
 * @param {string} platform - Platform name (optional)
 * @returns {Promise<Object>} Engagement rate calculation results
 */
async function calculateEngagementRate(likes, comments, shares, followers, platform) {
    try {
        // Validate inputs
        validateInputs(likes, comments, shares, followers);

        // Calculate total engagement
        const totalEngagement = likes + comments + shares;

        // Calculate engagement rate (percentage)
        const engagementRate = followers > 0 ? (totalEngagement / followers) * 100 : 0;

        // Calculate engagement per follower
        const engagementPerFollower = followers > 0 ? (totalEngagement / followers) : 0;

        // Get platform-specific benchmark
        const benchmark = getBenchmark(platform);

        // Determine performance level
        let performanceLevel = 'Below Average';
        if (engagementRate >= benchmark.excellent) {
            performanceLevel = 'Excellent';
        } else if (engagementRate >= benchmark.good) {
            performanceLevel = 'Good';
        } else if (engagementRate >= benchmark.average) {
            performanceLevel = 'Average';
        }

        return {
            engagementRate: parseFloat(engagementRate.toFixed(2)),
            totalEngagement,
            engagementPerFollower: parseFloat(engagementPerFollower.toFixed(4)),
            likes,
            comments,
            shares,
            followers,
            platform: platform || 'all',
            performanceLevel,
            benchmark
        };

    } catch (error) {
        console.error('Error calculating engagement rate:', error);
        throw error;
    }
}

/**
 * Validate Inputs
 * @param {number} likes - Number of likes
 * @param {number} comments - Number of comments
 * @param {number} shares - Number of shares
 * @param {number} followers - Number of followers
 * @throws {Error} If validation fails
 */
function validateInputs(likes, comments, shares, followers) {
    if (likes === undefined || likes === null || likes < 0) {
        throw new Error('Likes must be a non-negative number');
    }

    if (comments === undefined || comments === null || comments < 0) {
        throw new Error('Comments must be a non-negative number');
    }

    if (shares === undefined || shares === null || shares < 0) {
        throw new Error('Shares must be a non-negative number');
    }

    if (followers === undefined || followers === null || followers <= 0) {
        throw new Error('Followers must be a positive number');
    }

    // Check for reasonable maximums (prevent overflow)
    const MAX_VALUE = 1000000000; // 1 billion
    if (likes > MAX_VALUE || comments > MAX_VALUE || shares > MAX_VALUE || followers > MAX_VALUE) {
        throw new Error('Input values are too large. Maximum value is 1 billion.');
    }
}

/**
 * Get Platform-Specific Benchmark
 * @param {string} platform - Platform name
 * @returns {Object} Benchmark values (average, good, excellent)
 */
function getBenchmark(platform) {
    // Industry-standard engagement rate benchmarks by platform
    const benchmarks = {
        instagram: {
            average: 1.5,
            good: 3.0,
            excellent: 6.0,
            description: 'Instagram engagement rates'
        },
        facebook: {
            average: 0.5,
            good: 1.0,
            excellent: 2.0,
            description: 'Facebook engagement rates'
        },
        twitter: {
            average: 0.5,
            good: 1.0,
            excellent: 2.0,
            description: 'Twitter/X engagement rates'
        },
        tiktok: {
            average: 3.0,
            good: 6.0,
            excellent: 9.0,
            description: 'TikTok engagement rates'
        },
        youtube: {
            average: 1.0,
            good: 2.0,
            excellent: 4.0,
            description: 'YouTube engagement rates'
        },
        linkedin: {
            average: 0.5,
            good: 1.5,
            excellent: 3.0,
            description: 'LinkedIn engagement rates'
        }
    };

    // Default benchmark for 'all' or unknown platforms
    const defaultBenchmark = {
        average: 1.0,
        good: 2.5,
        excellent: 5.0,
        description: 'General social media engagement rates'
    };

    return benchmarks[platform?.toLowerCase()] || defaultBenchmark;
}

/**
 * Calculate Engagement Rate by Reach
 * Alternative calculation method using reach instead of followers
 * @param {number} likes - Number of likes
 * @param {number} comments - Number of comments
 * @param {number} shares - Number of shares
 * @param {number} reach - Number of people who saw the post
 * @returns {Promise<Object>} Engagement rate by reach
 */
async function calculateEngagementRateByReach(likes, comments, shares, reach) {
    try {
        if (reach <= 0) {
            throw new Error('Reach must be a positive number');
        }

        const totalEngagement = likes + comments + shares;
        const engagementRate = (totalEngagement / reach) * 100;
        const engagementPerReach = totalEngagement / reach;

        return {
            engagementRate: parseFloat(engagementRate.toFixed(2)),
            totalEngagement,
            engagementPerReach: parseFloat(engagementPerReach.toFixed(4)),
            reach
        };

    } catch (error) {
        console.error('Error calculating engagement rate by reach:', error);
        throw error;
    }
}

module.exports = {
    calculateEngagementRate,
    calculateEngagementRateByReach,
    validateInputs,
    getBenchmark
};

