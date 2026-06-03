import db from '../db.js';

/**
 * Create a new order with order items
 * 
 * @param {number} userId - The user placing the order
 * @param {Array} cart - Array of cart items
 * @param {number} total - Total price of the order
 * @param {string} specialRequest - Any special requests
 * @returns {Promise<Object>} The newly created order
 */
const createOrder = async (userId, cart, total, specialRequest) => {
    // Create the order first
    const orderQuery = `
        INSERT INTO orders (user_id, total_price, special_request, status)
        VALUES ($1, $2, $3, 'ordered')
        RETURNING id
    `;
    const orderResult = await db.query(orderQuery, [userId, total, specialRequest || null]);
    const orderId = orderResult.rows[0].id;

    // insert each cart item as an order item
    for (const item of cart) {
        const itemQuery = `
            INSERT INTO order_items (order_id, string_id, quantity, price)
            VALUES ($1, $2, $3, $4)
        `;
        await db.query(itemQuery, [orderId, item.id, item.quantity, item.price]);
    }

    return orderResult.rows[0];
};

export { createOrder };