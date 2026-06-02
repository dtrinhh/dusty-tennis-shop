import db from '../db.js';

/**
 * Get all order history from user
 * 
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} Array of order objects
 */
const getOrdersByUserId = async (userId) => {
    const query = `
        SELECT 
            orders.id,
            orders.status,
            orders.total_price,
            orders.special_request,
            orders.created_at,
            COUNT(order_items.id) AS item_count
        FROM orders
        LEFT JOIN order_items ON orders.id = order_items.order_id
        WHERE orders.user_id = $1
        GROUP BY orders.id
        ORDER BY orders.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows.map(order => ({
        id: order.id,
        status: order.status,
        totalPrice: order.total_price,
        specialRequest: order.special_request,
        createdAt: order.created_at,
        itemCount: order.item_count
    }));
};

/**
 * Get all reviews submitted by user
 * 
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} Array of review objects
 */
const getReviewsByUserId = async (userId) => {
    const query = `
        SELECT
            reviews.id,
            reviews.item_rating,
            reviews.review_text,
            reviews.created_at,
            strings.name AS string_name,
            strings.brand AS string_brand,
            strings.id AS string_id
        FROM reviews
        JOIN strings ON reviews.string_id = strings.id
        WHERE reviews.reviewer_id = $1
        ORDER BY reviews.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows.map(review => ({
        id: review.id,
        rating: review.item_rating,
        reviewText: review.review_text,
        createdAt: review.created_at,
        stringName: review.string_name,
        stringBrand: review.string_brand,
        stringId: review.string_id
    }));
};

export { getOrdersByUserId, getReviewsByUserId };