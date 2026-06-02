import db from '../db.js';

/**
 * Get dashboard summary stats
 */
const getDashboardStats = async () => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM strings) AS total_strings,
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT COUNT(*) FROM contact_messages WHERE status = 'received') AS unread_messages,
            (SELECT COUNT(*) FROM reviews) AS total_reviews
    `;
    const result = await db.query(query);
    return {
        totalUsers: result.rows[0].total_users,
        totalStrings: result.rows[0].total_strings,
        totalOrders: result.rows[0].total_orders,
        unreadMessages: result.rows[0].unread_messages,
        totalReviews: result.rows[0].total_reviews
    };
};

/**
 * Get all users with their roles
 */
const getAllUsers = async () => {
    const query = `
        SELECT
            users.id,
            users.name,
            users.email,
            users.created_at,
            roles.role_name AS "roleName"
        FROM users
        JOIN roles ON users.role_id = roles.id
        ORDER BY users.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        roleName: user.roleName
    }));
};

/**
 * Get all orders with user info
 */
const getAllOrders = async () => {
    const query = `
        SELECT
            orders.id,
            orders.status,
            orders.total_price,
            orders.special_request,
            orders.created_at,
            users.name AS user_name,
            COUNT(order_items.id) AS item_count
        FROM orders
        LEFT JOIN users ON orders.user_id = users.id
        LEFT JOIN order_items ON orders.id = order_items.order_id
        GROUP BY orders.id, users.name
        ORDER BY orders.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows.map(order => ({
        id: order.id,
        status: order.status,
        totalPrice: order.total_price,
        specialRequest: order.special_request,
        createdAt: order.created_at,
        userName: order.user_name,
        itemCount: order.item_count
    }));
};

/**
 * Update order status
 */
const updateOrderStatus = async (orderId, status) => {
    const query = `
        UPDATE orders
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, status
    `;
    const result = await db.query(query, [status, orderId]);
    return result.rows[0] || null;
};

/**
 * Get all contact messages
 */
const getAllContactMessages = async () => {
    const query = `
        SELECT id, name, email, message, status, created_at
        FROM contact_messages
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows.map(message => ({
        id: message.id,
        name: message.name,
        email: message.email,
        message: message.message,
        status: message.status,
        createdAt: message.created_at
    }));
};

/**
 * Update contact message status
 */
const updateMessageStatus = async (messageId, status) => {
    const query = `
        UPDATE contact_messages
        SET status = $1
        WHERE id = $2
        RETURNING id, status
    `;
    const result = await db.query(query, [status, messageId]);
    return result.rows[0] || null;
};

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
        stringName: review.string_name,
        stringBrand: review.string_brand,
        stringId: review.string_id
    }));
};

/**
 * Delete a review
 */
const deleteReview = async (reviewId) => {
    const query = 'DELETE FROM reviews WHERE id = $1';
    const result = await db.query(query, [reviewId]);
    return result.rowCount > 0;
};

/**
 * Delete a string product
 */
const deleteString = async (stringId) => {
    const query = 'DELETE FROM strings WHERE id = $1';
    const result = await db.query(query, [stringId]);
    return result.rowCount > 0;
};

/**
 * Add a new string product
 */
const addString = async (brand, name, material, color, price, description, stockQuantity) => {
    const query = `
        INSERT INTO strings (brand, name, material, color, price, description, stock_quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, brand, name, material, color, price, description, stock_quantity
    `;
    const result = await db.query(query, [brand, name, material, color, price, description, stockQuantity]);
    return result.rows[0];
};

/**
 * Update a string product
 */
const updateString = async (stringId, brand, name, material, color, price, description, stockQuantity) => {
    const query = `
        UPDATE strings
        SET brand = $1, name = $2, material = $3, color = $4, price = $5, 
            description = $6, stock_quantity = $7, updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING id, brand, name, material, color, price, description, stock_quantity
    `;
    const result = await db.query(query, [brand, name, material, color, price, description, stockQuantity, stringId]);
    return result.rows[0] || null;
};

export { getDashboardStats, getAllUsers, getAllOrders, updateOrderStatus, getAllContactMessages, updateMessageStatus, getAllReviews, deleteReview, deleteString, addString, updateString };
