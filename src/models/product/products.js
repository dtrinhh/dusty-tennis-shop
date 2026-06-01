import db from '../db.js';

/**
 * Core function to get a single string by ID.
 * This pattern (one function with a type parameter) reduces duplicate code.
 * 
 * @param {number} id - String product ID
 * @returns {Promise<Object>} String object or empty object if not found
*/
const getString = async (id) => {
    const query = `
    SELECT s.id, s.brand, s.name, s.material, s.color, s.price,
    s.description, s.stock_quantity
    FROM strings s
    WHERE s.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) return {};
    
    const string = result.rows[0];
    return {
        id: string.id,
        brand: string.brand,
        name: string.name,
        material: string.material,
        color: string.color,
        price: string.price,
        description: string.description,
        stockQuantity: string.stock_quantity
    };
};

/**
 * Get all strings with optional sorting.
 * 
 * @param {string} sortBy - Sort option: 'brand' (default), 'name', 'price'
 * @returns {Promise<Array>} Array of string objects
 */
const getAllStrings = async (sortBy = 'brand') => {
    const orderByClause = sortBy === 'name' ? 's.name' :
                          sortBy === 'price' ? 's.price' :
                          's.brand, s.name';

    const query = `
        SELECT s.id, s.brand, s.name, s.material, s.color, s.price, 
               s.description, s.stock_quantity
        FROM strings s
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query);

    return result.rows.map(string => ({
        id: string.id,
        brand: string.brand,
        name: string.name,
        material: string.material,
        color: string.color,
        price: string.price,
        description: string.description,
        stockQuantity: string.stock_quantity
    }));
};

/**
 * Get all strings filtered by brand.
 * 
 * @param {string} brand - Brand to filter by
 * @returns {Promise<Array>} Array of string objects for that brand
 */
const getStringsByBrand = async (brand) => {
    const query = `
        SELECT s.id, s.brand, s.name, s.material, s.color, s.price,
               s.description, s.stock_quantity
        FROM strings s
        WHERE LOWER(s.brand) = LOWER($1)
        ORDER BY s.name
    `;

    const result = await db.query(query, [brand]);

    return result.rows.map(string => ({
        id: string.id,
        brand: string.brand,
        name: string.name,
        material: string.material,
        color: string.color,
        price: string.price,
        description: string.description,
        stockQuantity: string.stock_quantity
    }));
};

/**
 * Wrapper functions for cleaner API - these make the code more readable at the call site.
 */
const getStringById = (stringId) => getString(id);

export { getAllStrings, getStringById, getStringsByBrand };