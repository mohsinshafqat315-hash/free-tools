/**
 * LinkedIn Profile Optimizer Controller
 * 
 * This controller handles LinkedIn profile analysis and optimization suggestions
 * 
 * Functions:
 * - analyzeProfile(profileData) - Analyze profile and generate recommendations
 * - calculateProfileScore(profileData) - Calculate profile strength score
 * - generateRecommendations(profileData, scores) - Generate optimization recommendations
 * - validateProfileData(profileData) - Validate input data
 */

/**
 * Analyze Profile
 * @param {Object} profileData - Profile data object
 * @returns {Promise<Object>} Analysis results with score and recommendations
 */
async function analyzeProfile(profileData) {
    try {
        // Validate inputs
        validateProfileData(profileData);

        // Calculate profile score
        const scoreResult = calculateProfileScore(profileData);

        // Generate recommendations
        const recommendations = generateRecommendations(profileData, scoreResult.categoryScores);

        return {
            profileScore: scoreResult.profileScore,
            scoreLevel: scoreResult.scoreLevel,
            scoreColor: scoreResult.scoreColor,
            totalScore: scoreResult.totalScore,
            maxScore: scoreResult.maxScore,
            categoryScores: scoreResult.categoryScores,
            recommendations: recommendations.sort((a, b) => {
                const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
        };

    } catch (error) {
        console.error('Error analyzing profile:', error);
        throw error;
    }
}

/**
 * Calculate Profile Score
 * @param {Object} profileData - Profile data object
 * @returns {Object} Score calculation results
 */
function calculateProfileScore(profileData) {
    let totalScore = 0;
    let maxScore = 0;
    const categoryScores = {};

    // Headline Analysis (20 points)
    maxScore += 20;
    if (profileData.headline) {
        const headlineLength = profileData.headline.length;
        if (headlineLength >= 10 && headlineLength <= 120) {
            const headlineScore = Math.min(20, (headlineLength / 120) * 20);
            totalScore += headlineScore;
            categoryScores.headline = headlineScore;
        }
    }

    // Summary Analysis (25 points)
    maxScore += 25;
    if (profileData.summary) {
        const summaryLength = profileData.summary.length;
        if (summaryLength >= 200) {
            const summaryScore = Math.min(25, (summaryLength / 2000) * 25);
            totalScore += summaryScore;
            categoryScores.summary = summaryScore;
        } else {
            categoryScores.summary = Math.min(25, (summaryLength / 200) * 25);
            totalScore += categoryScores.summary;
        }
    }

    // Experience Analysis (20 points)
    maxScore += 20;
    const experienceScore = Math.min(20, (profileData.experienceCount / 3) * 20);
    totalScore += experienceScore;
    categoryScores.experience = experienceScore;

    // Education Analysis (10 points)
    maxScore += 10;
    const educationScore = Math.min(10, (profileData.educationCount / 2) * 10);
    totalScore += educationScore;
    categoryScores.education = educationScore;

    // Skills Analysis (15 points)
    maxScore += 15;
    const skillsScore = Math.min(15, (profileData.skillsCount / 10) * 15);
    totalScore += skillsScore;
    categoryScores.skills = skillsScore;

    // Connections Analysis (10 points)
    maxScore += 10;
    const connectionsScore = Math.min(10, (profileData.connections / 500) * 10);
    totalScore += connectionsScore;
    categoryScores.connections = connectionsScore;

    // Profile Completeness (bonus points)
    let completenessBonus = 0;
    if (profileData.hasProfilePicture) {
        completenessBonus += 5;
        categoryScores.profilePicture = 5;
    }
    if (profileData.hasCustomUrl) {
        completenessBonus += 3;
        categoryScores.customUrl = 3;
    }
    if (profileData.hasCoverPhoto) {
        completenessBonus += 2;
        categoryScores.coverPhoto = 2;
    }
    if (profileData.hasRecommendations) {
        completenessBonus += 5;
        categoryScores.recommendations = 5;
    }

    totalScore += completenessBonus;
    maxScore += 15;

    // Calculate percentage
    const profileScore = Math.round((totalScore / maxScore) * 100);

    // Determine score level
    let scoreLevel = 'Needs Improvement';
    let scoreColor = '#ef4444';
    if (profileScore >= 90) {
        scoreLevel = 'Excellent';
        scoreColor = '#10b981';
    } else if (profileScore >= 75) {
        scoreLevel = 'Good';
        scoreColor = '#3b82f6';
    } else if (profileScore >= 60) {
        scoreLevel = 'Fair';
        scoreColor = '#f59e0b';
    }

    return {
        profileScore,
        scoreLevel,
        scoreColor,
        totalScore,
        maxScore,
        categoryScores
    };
}

/**
 * Generate Recommendations
 * @param {Object} profileData - Profile data object
 * @param {Object} categoryScores - Category scores object
 * @returns {Array} Array of recommendation objects
 */
function generateRecommendations(profileData, categoryScores) {
    const recommendations = [];

    // Headline recommendations
    if (!profileData.headline) {
        recommendations.push({
            priority: 'critical',
            category: 'Headline',
            message: 'Add a compelling headline that clearly communicates your value proposition and includes relevant keywords.'
        });
    } else {
        const headlineLength = profileData.headline.length;
        if (headlineLength < 10) {
            recommendations.push({
                priority: 'high',
                category: 'Headline',
                message: 'Your headline is too short. Expand it to at least 10-60 characters with relevant keywords.'
            });
        } else if (headlineLength < 60) {
            recommendations.push({
                priority: 'medium',
                category: 'Headline',
                message: 'Your headline could be more descriptive. Aim for 60-120 characters to include more keywords and value proposition.'
            });
        }
    }

    // Summary recommendations
    if (!profileData.summary) {
        recommendations.push({
            priority: 'critical',
            category: 'Summary',
            message: 'Add a compelling summary that tells your professional story, highlights achievements, and includes relevant keywords.'
        });
    } else {
        const summaryLength = profileData.summary.length;
        if (summaryLength < 200) {
            recommendations.push({
                priority: 'high',
                category: 'Summary',
                message: 'Your summary is too short. Aim for at least 200-500 characters to effectively communicate your professional story.'
            });
        } else if (summaryLength < 500) {
            recommendations.push({
                priority: 'medium',
                category: 'Summary',
                message: 'Expand your summary to at least 500 characters. Include your key achievements, skills, and what makes you unique.'
            });
        }
    }

    // Experience recommendations
    if (profileData.experienceCount < 2) {
        recommendations.push({
            priority: 'high',
            category: 'Experience',
            message: 'Add at least 2-3 detailed experience positions with descriptions, achievements, and quantifiable results.'
        });
    }

    // Education recommendations
    if (profileData.educationCount === 0) {
        recommendations.push({
            priority: 'medium',
            category: 'Education',
            message: 'Add your education history to complete your profile and improve credibility.'
        });
    }

    // Skills recommendations
    if (profileData.skillsCount < 5) {
        recommendations.push({
            priority: 'high',
            category: 'Skills',
            message: 'List at least 5-10 relevant skills. Seek endorsements from colleagues to increase credibility.'
        });
    }

    // Connections recommendations
    if (profileData.connections < 50) {
        recommendations.push({
            priority: 'medium',
            category: 'Connections',
            message: 'Build your network to at least 50 connections. Quality connections in your industry improve visibility.'
        });
    } else if (profileData.connections < 500) {
        recommendations.push({
            priority: 'low',
            category: 'Connections',
            message: 'Continue building your network. Aim for 500+ connections for maximum visibility.'
        });
    }

    // Profile completeness recommendations
    if (!profileData.hasProfilePicture) {
        recommendations.push({
            priority: 'critical',
            category: 'Profile Picture',
            message: 'Add a professional profile picture. Profiles with photos receive significantly more views.'
        });
    }

    if (!profileData.hasCustomUrl) {
        recommendations.push({
            priority: 'low',
            category: 'Custom URL',
            message: 'Create a custom LinkedIn URL (e.g., linkedin.com/in/yourname) for a more professional appearance.'
        });
    }

    if (!profileData.hasCoverPhoto) {
        recommendations.push({
            priority: 'low',
            category: 'Cover Photo',
            message: 'Add a cover photo to make your profile more visually appealing and professional.'
        });
    }

    if (!profileData.hasRecommendations) {
        recommendations.push({
            priority: 'medium',
            category: 'Recommendations',
            message: 'Request recommendations from colleagues, managers, or clients to add social proof to your profile.'
        });
    }

    return recommendations;
}

/**
 * Validate Profile Data
 * @param {Object} profileData - Profile data to validate
 * @throws {Error} If validation fails
 */
function validateProfileData(profileData) {
    if (!profileData) {
        throw new Error('Profile data is required');
    }

    if (profileData.headline && profileData.headline.length > 120) {
        throw new Error('Headline must be 120 characters or less');
    }

    if (profileData.summary && profileData.summary.length > 2000) {
        throw new Error('Summary must be 2000 characters or less');
    }

    if (profileData.experienceCount !== undefined && (profileData.experienceCount < 0 || profileData.experienceCount > 50)) {
        throw new Error('Experience count must be between 0 and 50');
    }

    if (profileData.educationCount !== undefined && (profileData.educationCount < 0 || profileData.educationCount > 20)) {
        throw new Error('Education count must be between 0 and 20');
    }

    if (profileData.skillsCount !== undefined && (profileData.skillsCount < 0 || profileData.skillsCount > 50)) {
        throw new Error('Skills count must be between 0 and 50');
    }

    if (profileData.connections !== undefined && profileData.connections < 0) {
        throw new Error('Connections must be a non-negative number');
    }
}

module.exports = {
    analyzeProfile,
    calculateProfileScore,
    generateRecommendations,
    validateProfileData
};

