import db from '../db.js';

/**
 * Get all reviews with user and string info
 */
const getAllReviews = async () => {
    const query = `
        SELECT
            reviews.id,
            reviews.item_rating,
            reviews.review_text,
            reviews.created_at,
            users.name AS reviewer_name,
            users.id AS reviewer_id,
            strings.name AS string_name,
            strings.brand AS string_brand,
            strings.id AS string_id
        FROM reviews
        JOIN users ON reviews.reviewer_id = users.id
        JOIN strings ON reviews.string_id = strings.id
        ORDER BY reviews.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows.map(review => ({
        id: review.id,
        rating: review.item_rating,
        reviewText: review.review_text,
        createdAt: review.created_at,
        reviewerName: review.reviewer_name,
        reviewerId: review.reviewer_id,
        stringName: review.string_name,
        stringBrand: review.string_brand,
        stringId: review.string_id
    }));
};

/**
 * Get a single review by ID
 */
const getReviewById = async (reviewId) => {
    const query = `
        SELECT
            reviews.id,
            reviews.item_rating,
            reviews.review_text,
            reviews.created_at,
            reviews.reviewer_id,
            users.name AS reviewer_name,
            strings.name AS string_name,
            strings.brand AS string_brand,
            strings.id AS string_id
        FROM reviews
        JOIN users ON reviews.reviewer_id = users.id
        JOIN strings ON reviews.string_id = strings.id
        WHERE reviews.id = $1
    `;
    const result = await db.query(query, [reviewId]);
    return result.rows[0] || null;
};

/**
 * Update own review 
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
 * Save a response to a review
 */
const saveReviewResponse = async (reviewId, responderId, responseText) => {
    const query = `
        INSERT INTO review_responses (review_id, responder_id, response_text)
        VALUES ($1, $2, $3)
        RETURNING id, response_text, created_at
    `;
    const result = await db.query(query, [reviewId, responderId, responseText]);
    return result.rows[0];
};

/**
 * Get all responses for a review
 */
const getResponsesByReviewId = async (reviewId) => {
    const query = `
        SELECT
            review_responses.id,
            review_responses.response_text,
            review_responses.created_at,
            users.name AS responder_name
        FROM review_responses
        JOIN users ON review_responses.responder_id = users.id
        WHERE review_responses.review_id = $1
        ORDER BY review_responses.created_at ASC
    `;
    const result = await db.query(query, [reviewId]);
    return result.rows.map(response => ({
        id: response.id,
        responseText: response.response_text,
        createdAt: response.created_at,
        responderName: response.responder_name
    }));
};

export { getAllReviews, getReviewById, updateReview, saveReviewResponse, getResponsesByReviewId };