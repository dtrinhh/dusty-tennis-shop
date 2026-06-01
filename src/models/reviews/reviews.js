import db from '../db.js';

/**
 * Get all reviews for a single string
 * 
 * @param {number} stringId - The string product ID
 * @returns {Promise<Array>} Array of review objects
 */
const getReviewsByStringId = async (stringId) => {
    const query = `
        SELECT 
            reviews.id,
            reviews.item_rating,
            reviews.review_text,
            reviews.created_at,
            users.name AS reviewer_name
        FROM reviews
        JOIN users ON reviews.reviewer_id = users.id
        WHERE reviews.string_id = $1
        ORDER BY reviews.created_at DESC
    `;
    const result = await db.query(query, [stringId]);
    return result.rows.map(review => ({
        id: review.id,
        rating: review.item_rating,
        reviewText: review.review_text,
        createdAt: review.created_at,
        reviewerName: review.reviewer_name
    }));
};

/**
 * Get the average rating for a single string
 * 
 * @param {number} stringId - The string product ID
 * @returns {Promise<number>} Average rating out of five or 0 if no reviews
 */
const getAverageRating = async (stringId) => {
    const query = `
        SELECT ROUND(AVG(item_rating), 1) AS average_rating
        FROM reviews
        WHERE string_id = $1
    `;
    const result = await db.query(query, [stringId]);
    return result.rows[0].average_rating || 0;
};

/**
 * Save a new review to the database
 * 
 * @param {number} stringId - The string product ID
 * @param {number} reviewerId - The user ID of the reviewer
 * @param {number} rating - The rating (1-5)
 * @param {string} reviewText - The review text
 * @returns {Promise<Object>} The newly created review
 */
const saveReview = async (stringId, reviewerId, rating, reviewText) => {
    const query = `
        INSERT INTO reviews (string_id, reviewer_id, item_rating, review_text)
        VALUES ($1, $2, $3, $4)
        RETURNING id, item_rating, review_text, created_at
    `;
    const result = await db.query(query, [stringId, reviewerId, rating, reviewText]);
    return result.rows[0];
};

export { getReviewsByStringId, getAverageRating, saveReview };