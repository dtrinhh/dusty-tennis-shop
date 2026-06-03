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

/**
 * Delete a review by ID
 * 
 * @param {number} reviewId - The review ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteReview = async (reviewId) => {
    const query = 'DELETE FROM reviews WHERE id = $1';
    const result = await db.query(query, [reviewId]);
    return result.rowCount > 0;
};

/**
 * Update a review by ID
 * 
 * @param {number} reviewId - The review ID
 * @param {number} rating - The new rating
 * @param {string} reviewText - The new review text
 * @returns {Promise<Object>} The updated review
 */
const updateReview = async (reviewId, rating, reviewText) => {
    const query = `
        UPDATE reviews
        SET item_rating = $1, review_text = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, item_rating, review_text
    `;
    const result = await db.query(query, [rating, reviewText, reviewId]);
    return result.rows[0] || null;
};

/**
 * Get a single review by ID
 * 
 * @param {number} reviewId - The review ID
 * @returns {Promise<Object>} The review object
 */
const getReviewById = async (reviewId) => {
    const query = `
        SELECT
            reviews.id,
            reviews.item_rating,
            reviews.review_text,
            reviews.created_at,
            reviews.reviewer_id,
            reviews.string_id,
            users.name AS reviewer_name,
            strings.name AS string_name,
            strings.brand AS string_brand
        FROM reviews
        JOIN users ON reviews.reviewer_id = users.id
        JOIN strings ON reviews.string_id = strings.id
        WHERE reviews.id = $1
    `;
    const result = await db.query(query, [reviewId]);
    return result.rows[0] || null;
};

export { getReviewsByStringId, getAverageRating, saveReview, deleteReview, updateReview, getReviewById };