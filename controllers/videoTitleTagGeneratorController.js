/**
 * Video Title & Tag Generator Controller
 * 
 * This controller handles video title and tag generation for multiple platforms
 * 
 * Functions:
 * - generateTitlesAndTags(topic, platform, category, titleCount, tagCount) - Generate titles and tags
 * - validateTopic(topic) - Validate input topic
 * - generateTitles(topic, platform, category, count) - Generate titles
 * - generateTags(topic, platform, category, count) - Generate tags
 */

/**
 * Generate Titles and Tags
 * @param {string} topic - Topic or keyword
 * @param {string} platform - Video platform (youtube, tiktok, instagram, facebook, all)
 * @param {string} category - Video category (optional)
 * @param {number} titleCount - Number of titles to generate
 * @param {number} tagCount - Number of tags to generate
 * @returns {Promise<Object>} Object with titles and tags arrays
 */
async function generateTitlesAndTags(topic, platform, category, titleCount, tagCount) {
    try {
        // Validate inputs
        validateTopic(topic);

        const titles = await generateTitles(topic, platform, category, titleCount);
        const tags = await generateTags(topic, platform, category, tagCount);

        return {
            titles,
            tags
        };

    } catch (error) {
        console.error('Error generating titles and tags:', error);
        throw error;
    }
}

/**
 * Validate Topic
 * @param {string} topic - Topic to validate
 * @throws {Error} If validation fails
 */
function validateTopic(topic) {
    if (!topic || topic.trim().length === 0) {
        throw new Error('Topic is required');
    }

    if (topic.length < 2) {
        throw new Error('Topic must be at least 2 characters long');
    }

    if (topic.length > 200) {
        throw new Error('Topic must be less than 200 characters');
    }
}

/**
 * Generate Titles
 * @param {string} topic - Topic or keyword
 * @param {string} platform - Video platform
 * @param {string} category - Video category
 * @param {number} count - Number of titles to generate
 * @returns {Promise<Array>} Array of title strings
 */
async function generateTitles(topic, platform, category, count) {
    // TODO: Integrate with AI/ML service for better title generation
    // This is a placeholder implementation using templates
    
    const topicWords = topic.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const baseTopic = topicWords[0] || topic.toLowerCase();
    const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    
    const titleTemplates = [
        `The Ultimate Guide to ${capitalizedTopic}`,
        `How to ${capitalizedTopic}: Complete Tutorial`,
        `${capitalizedTopic} Explained: Everything You Need to Know`,
        `Top 10 ${capitalizedTopic} Tips and Tricks`,
        `${capitalizedTopic} Secrets Revealed`,
        `Best ${capitalizedTopic} Strategies for 2024`,
        `${capitalizedTopic} for Beginners: Step-by-Step Guide`,
        `Why ${capitalizedTopic} Matters: Expert Insights`,
        `${capitalizedTopic} Masterclass: Advanced Techniques`,
        `5 Ways to Master ${capitalizedTopic}`,
        `The Truth About ${capitalizedTopic}`,
        `${capitalizedTopic} Hacks That Actually Work`,
        `Complete ${capitalizedTopic} Guide: From Start to Finish`,
        `${capitalizedTopic} Made Simple: Easy Tutorial`,
        `Expert ${capitalizedTopic} Tips You Need to Know`,
        `${capitalizedTopic} Breakdown: What You're Missing`,
        `How I Mastered ${capitalizedTopic} (Full Guide)`,
        `${capitalizedTopic} Essentials: Must-Know Information`,
        `The ${capitalizedTopic} Playbook: Complete Strategy`,
        `${capitalizedTopic} Tutorial: Learn the Basics`
    ];

    // Platform-specific templates
    const platformTemplates = {
        youtube: [
            `${capitalizedTopic} - Full Tutorial 2024`,
            `Everything You Need to Know About ${capitalizedTopic}`,
            `${capitalizedTopic} Explained in 10 Minutes`
        ],
        tiktok: [
            `${capitalizedTopic} in 60 seconds!`,
            `POV: You're learning ${capitalizedTopic}`,
            `${capitalizedTopic} but make it ✨aesthetic✨`,
            `Quick ${capitalizedTopic} tips you need!`
        ],
        instagram: [
            `${capitalizedTopic} Reel 🎬`,
            `How to ${capitalizedTopic} | Reels`,
            `${capitalizedTopic} tips that changed my life`
        ],
        facebook: [
            `${capitalizedTopic}: What You Need to Know`,
            `Learn ${capitalizedTopic} Today`,
            `${capitalizedTopic} Guide for Everyone`
        ]
    };

    // Category-specific templates
    const categoryTemplates = {
        education: [
            `Learn ${capitalizedTopic} in 10 Minutes`,
            `${capitalizedTopic} Course: Full Tutorial`,
            `Master ${capitalizedTopic}: Educational Guide`
        ],
        entertainment: [
            `${capitalizedTopic} That Will Blow Your Mind`,
            `Funny ${capitalizedTopic} Moments`,
            `${capitalizedTopic} Compilation: Best Moments`
        ],
        gaming: [
            `${capitalizedTopic} Gameplay Walkthrough`,
            `${capitalizedTopic} Tips and Tricks for Gamers`,
            `How to Win at ${capitalizedTopic}`
        ],
        tech: [
            `${capitalizedTopic} Tech Review: Everything You Need to Know`,
            `${capitalizedTopic} Explained: Technology Breakdown`,
            `Best ${capitalizedTopic} Tools and Software`
        ],
        fitness: [
            `${capitalizedTopic} Workout Routine`,
            `${capitalizedTopic} Fitness Tips for Results`,
            `How to Achieve ${capitalizedTopic} Goals`
        ]
    };

    let allTemplates = [...titleTemplates];
    if (platform && platform !== 'all' && platformTemplates[platform]) {
        allTemplates = [...allTemplates, ...platformTemplates[platform]];
    }
    if (category && categoryTemplates[category]) {
        allTemplates = [...allTemplates, ...categoryTemplates[category]];
    }

    // Shuffle and select
    const shuffled = allTemplates.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(title => title.replace(/\${topic}/g, topic));
}

/**
 * Generate Tags
 * @param {string} topic - Topic or keyword
 * @param {string} platform - Video platform
 * @param {string} category - Video category
 * @param {number} count - Number of tags to generate
 * @returns {Promise<Array>} Array of tag strings
 */
async function generateTags(topic, platform, category, count) {
    // TODO: Integrate with keyword research API or database
    // This is a placeholder implementation
    
    const topicWords = topic.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const baseTopic = topicWords[0] || topic.toLowerCase();
    
    const baseTags = [
        topic.toLowerCase(),
        ...topicWords,
        `${baseTopic} tutorial`,
        `${baseTopic} guide`,
        `${baseTopic} tips`,
        `how to ${baseTopic}`,
        `${baseTopic} for beginners`,
        `learn ${baseTopic}`,
        `${baseTopic} explained`,
        `${baseTopic} 2024`
    ];

    // Platform-specific tags
    const platformTags = {
        youtube: ['youtube', 'video', 'tutorial', 'how to', 'guide', 'youtube video', 'youtube tutorial'],
        tiktok: ['tiktok', 'fyp', 'foryou', 'viral', 'trending', 'tiktokvideo', 'tiktoktrend'],
        instagram: ['instagram', 'reels', 'instagramreels', 'reelsvideo', 'instavideo', 'reel'],
        facebook: ['facebook', 'facebookvideo', 'video', 'fbvideo', 'facebook watch']
    };

    if (platform && platform !== 'all' && platformTags[platform]) {
        baseTags.push(...platformTags[platform]);
    }

    // Category-specific tags
    const categoryTags = {
        education: ['education', 'tutorial', 'how to', 'learn', 'guide', 'course', 'lesson'],
        entertainment: ['entertainment', 'funny', 'comedy', 'viral', 'trending', 'fun'],
        gaming: ['gaming', 'gameplay', 'walkthrough', 'gamer', 'video games', 'gaming tips'],
        tech: ['technology', 'tech', 'review', 'gadgets', 'tech news', 'innovation'],
        fitness: ['fitness', 'workout', 'health', 'exercise', 'training', 'gym'],
        food: ['cooking', 'recipe', 'food', 'cooking tips', 'kitchen', 'chef'],
        travel: ['travel', 'travel vlog', 'adventure', 'wanderlust', 'vacation', 'tourism'],
        lifestyle: ['lifestyle', 'vlog', 'daily life', 'lifestyle tips', 'living'],
        beauty: ['beauty', 'makeup', 'skincare', 'beauty tips', 'cosmetics', 'fashion'],
        business: ['business', 'entrepreneurship', 'startup', 'business tips', 'success']
    };

    if (category && categoryTags[category]) {
        baseTags.push(...categoryTags[category]);
    }

    // Add common video tags
    const commonTags = [
        'video',
        'tutorial',
        'guide',
        'tips',
        'how to',
        'explained',
        '2024',
        'best',
        'top',
        'review',
        'complete guide'
    ];

    // Combine and remove duplicates
    const allTags = [...new Set([...baseTags, ...commonTags])];
    const shuffled = allTags.sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, count);
}

/**
 * Validate Platform
 * @param {string} platform - Platform to validate
 * @returns {boolean} True if valid
 */
function validatePlatform(platform) {
    const validPlatforms = ['youtube', 'tiktok', 'instagram', 'facebook', 'all'];
    return validPlatforms.includes(platform);
}

/**
 * Validate Category
 * @param {string} category - Category to validate
 * @returns {boolean} True if valid
 */
function validateCategory(category) {
    if (!category) return true; // Category is optional
    
    const validCategories = [
        'education', 'entertainment', 'gaming', 'music', 'sports', 'tech',
        'lifestyle', 'food', 'travel', 'fitness', 'beauty', 'business', 'comedy'
    ];
    return validCategories.includes(category);
}

module.exports = {
    generateTitlesAndTags,
    validateTopic,
    generateTitles,
    generateTags,
    validatePlatform,
    validateCategory
};

