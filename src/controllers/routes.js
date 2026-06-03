import { Router } from 'express';
import { homePage, aboutPage } from './index.js';
import { productsPage, productDetailPage } from './product/products.js';
import { processReview } from './reviews/reviews.js';
import ContactRoutes from './forms/contact.js';
import loginRoutes from './forms/login.js';
import registrationRoutes from './forms/registration.js';
import { processLogout } from './forms/login.js';
import accountRoutes from './account/account.js';
import adminRoutes from './admin/admin.js';
import productTesterRoutes from './productTester/productTester.js';

// Create a new router instance
const router = Router();

// Route definitions
// Home and about page
router.get('/', homePage);
router.get('/about', aboutPage);

// Product routes
router.get('/products', productsPage);
router.get('/products/:id', productDetailPage);

// Review routes
router.post('/products/:id/review', processReview)

// Contact routes
router.use('/contact', ContactRoutes)

// Authentication-related routes at root level
router.use('/register', registrationRoutes);
router.use('/login', loginRoutes);
router.get('/logout', processLogout);

// Account routes
router.use('/account', accountRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// ProductTester routes
router.use('/producttesterdashboard', productTesterRoutes);

export default router;