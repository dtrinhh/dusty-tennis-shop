import { Router } from 'express';
import { homePage, aboutPage } from './index.js';
import { productsPage, productDetailPage } from './product/products.js';
import { processReview } from './reviews/reviews.js';
import ContactRoutes from './forms/contact.js';

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

export default router;