/**
 * YouTube Title & Tag Generator Controller
 * 
 * This controller handles YouTube title and tag generation functionality
 * 
 * Functions:
 * - generateTitlesAndTags(topic, category, titleCount, tagCount) - Generate titles and tags
 * - validateTopic(topic) - Validate input topic
 * - generateTitles(topic, category, count) - Generate optimized titles
 * - generateTags(topic, category, count) - Generate optimized tags
 */

/**
 * Generate Titles and Tags
 * @param {string} topic - Topic or keyword
 * @param {string} category - Video category (optional)
 * @param {number} titleCount - Number of titles to generate (5-20)
 * @param {number} tagCount - Number of tags to generate (15-40)
 * @returns {Promise<Object>} Generated titles and tags
 */
async function generateTitlesAndTags(topic, category, titleCount, tagCount) {
    try {
        // Validate inputs
        validateTopic(topic);

        const targetTitleCount = Math.min(Math.max(titleCount || 10, 5), 20);
        const targetTagCount = Math.min(Math.max(tagCount || 20, 15), 40);

        // Generate titles and tags
        const titles = await generateTitles(topic, category, targetTitleCount);
        const tags = await generateTags(topic, category, targetTagCount);

        return {
            titles,
            tags,
            titleCount: titles.length,
            tagCount: tags.length,
            category: category || 'all'
        };

    } catch (error) {
        console.error('Error generating titles and tags:', error);
        throw error;
    }
}

/**
 * Generate Optimized Titles
 * @param {string} topic - Topic or keyword
 * @param {string} category - Video category (optional)
 * @param {number} count - Number of titles to generate
 * @returns {Promise<Array<string>>} Array of generated titles
 */
async function generateTitles(topic, category, count) {
    try {
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

        // Add category-specific templates
        const categoryTemplates = {
            education: [
                `Learn ${capitalizedTopic} in 10 Minutes`,
                `${capitalizedTopic} Course: Full Tutorial`,
                `Master ${capitalizedTopic}: Educational Guide`,
                `${capitalizedTopic} Explained Simply`,
                `Complete ${capitalizedTopic} Learning Guide`
            ],
            entertainment: [
                `${capitalizedTopic} That Will Blow Your Mind`,
                `Funny ${capitalizedTopic} Moments`,
                `${capitalizedTopic} Compilation: Best Moments`,
                `Epic ${capitalizedTopic} Video`,
                `${capitalizedTopic} You Won't Believe`
            ],
            gaming: [
                `${capitalizedTopic} Gameplay Walkthrough`,
                `${capitalizedTopic} Tips and Tricks for Gamers`,
                `How to Win at ${capitalizedTopic}`,
                `${capitalizedTopic} Game Review`,
                `Best ${capitalizedTopic} Strategies`
            ],
            tech: [
                `${capitalizedTopic} Tech Review: Everything You Need to Know`,
                `${capitalizedTopic} Explained: Technology Breakdown`,
                `Best ${capitalizedTopic} Tools and Software`,
                `${capitalizedTopic} Tech Guide 2024`,
                `Ultimate ${capitalizedTopic} Technology Review`
            ],
            fitness: [
                `${capitalizedTopic} Workout Routine`,
                `${capitalizedTopic} Fitness Tips for Results`,
                `How to Achieve ${capitalizedTopic} Goals`,
                `${capitalizedTopic} Training Program`,
                `Best ${capitalizedTopic} Exercises`
            ],
            food: [
                `${capitalizedTopic} Recipe: Easy Cooking Guide`,
                `How to Make ${capitalizedTopic}`,
                `${capitalizedTopic} Cooking Tips`,
                `Delicious ${capitalizedTopic} Recipe`,
                `${capitalizedTopic} Food Guide`
            ],
            travel: [
                `${capitalizedTopic} Travel Guide`,
                `Best ${capitalizedTopic} Destinations`,
                `${capitalizedTopic} Travel Tips`,
                `Exploring ${capitalizedTopic}: Travel Vlog`,
                `${capitalizedTopic} Adventure Guide`
            ],
            lifestyle: [
                `${capitalizedTopic} Lifestyle Tips`,
                `How to Live ${capitalizedTopic}`,
                `${capitalizedTopic} Lifestyle Guide`,
                `Daily ${capitalizedTopic} Routine`,
                `${capitalizedTopic} Life Hacks`
            ],
            beauty: [
                `${capitalizedTopic} Beauty Tips`,
                `${capitalizedTopic} Makeup Tutorial`,
                `Best ${capitalizedTopic} Beauty Products`,
                `${capitalizedTopic} Skincare Guide`,
                `${capitalizedTopic} Beauty Secrets`
            ],
            business: [
                `${capitalizedTopic} Business Strategy`,
                `How to Succeed in ${capitalizedTopic}`,
                `${capitalizedTopic} Entrepreneurship Guide`,
                `${capitalizedTopic} Business Tips`,
                `Mastering ${capitalizedTopic} Business`
            ]
        };

        let allTemplates = [...titleTemplates];
        if (category && categoryTemplates[category]) {
            allTemplates = [...allTemplates, ...categoryTemplates[category]];
        }

        // Shuffle and select
        const shuffled = allTemplates.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);

    } catch (error) {
        console.error('Error generating titles:', error);
        throw error;
    }
}

/**
 * Generate Optimized Tags
 * @param {string} topic - Topic or keyword
 * @param {string} category - Video category (optional)
 * @param {number} count - Number of tags to generate
 * @returns {Promise<Array<string>>} Array of generated tags
 */
async function generateTags(topic, category, count) {
    try {
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
            `${baseTopic} 2024`,
            `youtube ${baseTopic}`,
            `${baseTopic} video`
        ];

        // Add category-specific tags
        const categoryTags = {
            education: ['education', 'tutorial', 'how to', 'learn', 'guide', 'course', 'lesson', 'educational', 'teaching'],
            entertainment: ['entertainment', 'funny', 'comedy', 'viral', 'trending', 'fun', 'entertaining', 'comedy video'],
            gaming: ['gaming', 'gameplay', 'walkthrough', 'gamer', 'video games', 'gaming tips', 'game review', 'gaming channel'],
            tech: ['technology', 'tech', 'review', 'gadgets', 'tech news', 'innovation', 'tech review', 'tech tips'],
            fitness: ['fitness', 'workout', 'health', 'exercise', 'training', 'gym', 'fitness tips', 'workout routine'],
            food: ['cooking', 'recipe', 'food', 'cooking tips', 'kitchen', 'chef', 'food recipe', 'cooking tutorial'],
            travel: ['travel', 'travel vlog', 'adventure', 'wanderlust', 'vacation', 'tourism', 'travel guide', 'travel tips'],
            lifestyle: ['lifestyle', 'vlog', 'daily life', 'lifestyle tips', 'living', 'lifestyle vlog', 'daily routine'],
            beauty: ['beauty', 'makeup', 'skincare', 'beauty tips', 'cosmetics', 'fashion', 'beauty tutorial', 'makeup tutorial'],
            business: ['business', 'entrepreneurship', 'startup', 'business tips', 'success', 'business strategy', 'entrepreneur']
        };

        if (category && categoryTags[category]) {
            baseTags.push(...categoryTags[category]);
        }

        // Add common YouTube tags
        const commonTags = [
            'youtube',
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
            'complete guide',
            'beginner friendly',
            'easy tutorial'
        ];

        // Combine and remove duplicates
        const allTags = [...new Set([...baseTags, ...commonTags])];
        const shuffled = allTags.sort(() => Math.random() - 0.5);
        
        return shuffled.slice(0, count);

    } catch (error) {
        console.error('Error generating tags:', error);
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

    if (topic.length > 200) {
        throw new Error('Topic must be less than 200 characters');
    }
}

module.exports = {
    generateTitlesAndTags,
    generateTitles,
    generateTags,
    validateTopic
};

