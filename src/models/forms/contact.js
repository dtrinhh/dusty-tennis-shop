import db from '../db.js';

/**
 * Inserts a new contact message submission into the database.
 * 
 * @param {string} name - Users name
 * @param {string} email - Users email
 * @param {string} message - The message content
 * @returns {Promise<Object>} The newly created contact message record
 */
const createContactMessage = async (name, email, message) => {
    const query = `
        INSERT INTO contact_messages (name, email, message)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, message, created_at
    `;
    const result = await db.query(query, [name, email, message]);
    return result.rows[0];
};

export { createContactMessage };