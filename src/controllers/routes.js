import { Router } from 'express';
import { homePage, aboutPage } from './index.js';
import { productsPage, productDetailPage } from './product/products.js';

// Create a new router instance
const router = Router();

// Route definitions
// Home and about page
router.get('/', homePage);
router.get('/about', aboutPage);

// Product routes
router.get('/products', productsPage);
router.get('/products/:id', productDetailPage);

export default router;