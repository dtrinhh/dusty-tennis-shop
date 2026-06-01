-- Database seed file for Dusty Tennis Shop
-- This file creates tables and inserts all initial data

BEGIN;

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS strings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL
);

-- Create strings table
CREATE TABLE strings (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    material VARCHAR(30),
    color VARCHAR(20),
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    string_id INTEGER REFERENCES strings(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_rating INTEGER,
    review_text VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'ordered',
    total_price DECIMAL(10,2) DEFAULT 0,
    special_request TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    string_id INTEGER REFERENCES strings(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL
);

-- Create contact messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'received',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed roles
INSERT INTO roles (role_name, role_description) VALUES
    ('admin', 'Full access permissions, user account read/write permissions, review read/write permissions, product read/write permissions'),
    ('employee', 'Product tester review section read/write permissions, review Response read/write permissions, purchase product at discounted rate'),
    ('customer', 'Customer review section read/write permissions, product tester review section read permissions, purchase product at full price');

-- Seed test users
INSERT INTO users (name, email, password, role_id) VALUES
    ('Admin', 'admin@dts.com', 'P@$$w0rd!', 1),
    ('Product Tester', 'Tester@dts.com', 'P@$$w0rd!', 2),
    ('User', 'user@dts.com', 'P@$$w0rd!', 3);

-- Seed string products
INSERT INTO strings (brand, name, material, color, price, description, stock_quantity) VALUES
    ('Grapplesnake', 'Tour Sniper', 'Polyester', 'Grey', 14.49, 'Massive Spin, maximum control, great tension maintenance', 50),
    ('Wilson', 'NXT', 'Multifilament', 'Natural', 14.00, 'Comfortable and powerful multifilament string', 40),
    ('Luxilon', 'ALU Power', 'Polyester', 'Silver', 21.50, 'Ultimate feel and control', 60),
    ('Toroline', 'O-Toro', 'Polyester', 'Orange', 15.00, 'Ultra-spin friendly co-poly', 50),
    ('Head', 'Lynx', 'Polyester', 'Champagne', 12.99, 'Control to attack the ball with your most powerful strokes', 45);

COMMIT;