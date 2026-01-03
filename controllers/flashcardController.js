/**
 * Flashcard Controller
 * 
 * This controller handles flashcard functionality
 * 
 * Functions:
 * - createCard(cardData) - Create a new flashcard
 * - getCards(userId) - Get all flashcards for a user
 * - updateCard(cardId, updates) - Update a flashcard
 * - deleteCard(cardId) - Delete a flashcard
 * - updateReview(cardId, difficulty, correct) - Update review data with spaced repetition
 * - validateCard(cardData) - Validate card data
 */

/**
 * Create Flashcard
 * @param {Object} cardData - Card data
 * @returns {Promise<Object>} Created flashcard
 */
async function createCard(cardData) {
    try {
        // Validate card data
        validateCard(cardData);

        // TODO: Save to database
        // This would require:
        // 1. Database schema for flashcards (id, userId, front, back, category, tags, createdAt, reviewData)
        // 2. Database connection and query execution
        // 3. User authentication/authorization

        const card = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            front: cardData.front,
            back: cardData.back,
            category: cardData.category,
            tags: cardData.tags || [],
            createdAt: new Date().toISOString(),
            reviewData: {
                lastReviewed: null,
                nextReview: new Date().toISOString(),
                difficulty: 2.5,
                reviewCount: 0,
                correctCount: 0,
                interval: 1, // Days
                easeFactor: 2.5
            }
        };

        return card;

    } catch (error) {
        console.error('Error creating flashcard:', error);
        throw error;
    }
}

/**
 * Get Flashcards
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of flashcards
 */
async function getCards(userId) {
    try {
        // TODO: Query database for user's flashcards
        // SELECT * FROM flashcards WHERE userId = ? ORDER BY createdAt DESC

        return [];

    } catch (error) {
        console.error('Error getting flashcards:', error);
        throw error;
    }
}

/**
 * Update Review Data (Spaced Repetition - Simplified SM-2)
 * @param {string} cardId - Card ID
 * @param {string} difficulty - Difficulty rating ('easy', 'medium', 'hard')
 * @param {boolean} correct - Whether the answer was correct
 * @returns {Promise<Object>} Updated review data
 */
async function updateReview(cardId, difficulty, correct) {
    try {
        // TODO: Get card from database
        // const card = await getCardById(cardId);

        // Simplified SM-2 algorithm
        const reviewData = {
            lastReviewed: new Date().toISOString(),
            reviewCount: 1, // This would be incremented from existing value
            correctCount: correct ? 1 : 0,
            difficulty: 2.5,
            interval: 1,
            easeFactor: 2.5
        };

        // Update based on difficulty
        if (difficulty === 'easy') {
            reviewData.easeFactor = Math.max(1.3, reviewData.easeFactor + 0.15);
            reviewData.interval = Math.round(reviewData.interval * reviewData.easeFactor * 1.5);
        } else if (difficulty === 'medium') {
            reviewData.easeFactor = Math.max(1.3, reviewData.easeFactor + 0.1);
            reviewData.interval = Math.round(reviewData.interval * reviewData.easeFactor);
        } else { // hard
            reviewData.easeFactor = Math.max(1.3, reviewData.easeFactor - 0.15);
            reviewData.interval = Math.max(1, Math.round(reviewData.interval * 0.8));
        }

        // Calculate next review date
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + reviewData.interval);
        reviewData.nextReview = nextReviewDate.toISOString();

        // TODO: Update in database
        // UPDATE flashcards SET reviewData = ? WHERE id = ? AND userId = ?

        return reviewData;

    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
}

/**
 * Validate Card
 * @param {Object} cardData - Card data
 * @throws {Error} If validation fails
 */
function validateCard(cardData) {
    if (!cardData.front || cardData.front.trim().length < 1) {
        throw new Error('Front text is required');
    }

    if (!cardData.back || cardData.back.trim().length < 1) {
        throw new Error('Back text is required');
    }

    if (!cardData.category || cardData.category.trim().length < 1) {
        throw new Error('Category is required');
    }

    if (cardData.tags && !Array.isArray(cardData.tags)) {
        throw new Error('Tags must be an array');
    }
}

module.exports = {
    createCard,
    getCards,
    updateReview,
    validateCard
};

