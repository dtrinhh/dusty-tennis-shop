import { Router } from 'express';
import { getDashboardStats, getAllUsers, getAllOrders, updateOrderStatus, getAllContactMessages, updateMessageStatus, getAllReviews, deleteReview, deleteString, addString, updateString } from '../../models/admin/admin.js';
import { getAllStrings, getStringById } from '../../models/product/products.js';
import { requireLogin, requireRole } from '../../middleware/auth.js';

const router = Router();


// Apply requireLogin and requireRole to all admin routes
router.use(requireLogin);
router.use(requireRole('admin'));

/**
 * GET /admin - Dashboard overview
 */
router.get('/', async (req, res) => {
    const stats = await getDashboardStats();
    res.render('admin/index', {
        title: 'Admin Dashboard',
        stats
    });
});

/**
 * GET /admin/users - Manage users
 */
router.get('/users', async (req, res) => {
    const users = await getAllUsers();
    res.render('admin/users', {
        title: 'Manage Users',
        users
    });
});

/**
 * GET /admin/products - Manage products
 */
router.get('/products', async (req, res) => {
    const strings = await getAllStrings();
    res.render('admin/products', {
        title: 'Manage Products',
        strings
    });
});

/**
 * GET /admin/products/add - Show add product form
 */
router.get('/products/add', (req, res) => {
    res.render('admin/product-form', {
        title: 'Add Product',
        string: null
    });
});

/**
 * POST /admin/products/add - Process add product form
 */
router.post('/products/add', async (req, res) => {
    const { brand, name, material, color, price, description, stockQuantity } = req.body;

    try {
        await addString(brand, name, material, color, price, description, stockQuantity);
        req.flash('success', 'Product added successfully!');
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error adding product:', error);
        req.flash('error', 'Error adding product. Please try again.');
        res.redirect('/admin/products/add');
    }
});

/**
 * GET /admin/products/:id/edit - Show edit product form
 */
router.get('/products/:id/edit', async (req, res) => {
    const stringId = parseInt(req.params.id);
    const string = await getStringById(stringId);

    if (!string || Object.keys(string).length === 0) {
        req.flash('error', 'Product not found.');
        return res.redirect('/admin/products');
    }

    res.render('admin/product-form', {
        title: 'Edit Product',
        string
    });
});

/**
 * POST /admin/products/:id/edit - Process edit product form
 */
router.post('/products/:id/edit', async (req, res) => {
    const stringId = parseInt(req.params.id);
    const { brand, name, material, color, price, description, stockQuantity } = req.body;

    try {
        await updateString(stringId, brand, name, material, color, price, description, stockQuantity);
        req.flash('success', 'Product updated successfully!');
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error updating product:', error);
        req.flash('error', 'Error updating product. Please try again.');
        res.redirect(`/admin/products/${stringId}/edit`);
    }
});

/**
 * POST /admin/products/:id/delete - Delete product
 */
router.post('/products/:id/delete', async (req, res) => {
    const stringId = parseInt(req.params.id);

    try {
        await deleteString(stringId);
        req.flash('success', 'Product deleted successfully!');
    } catch (error) {
        console.error('Error deleting product:', error);
        req.flash('error', 'Error deleting product. Please try again.');
    }

    res.redirect('/admin/products');
});

/**
 * GET /admin/orders - View all orders
 */
router.get('/orders', async (req, res) => {
    const orders = await getAllOrders();
    res.render('admin/orders', {
        title: 'Manage Orders',
        orders
    });
});

/**
 * POST /admin/orders/:id/status - Update order status
 */
router.post('/orders/:id/status', async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    try {
        await updateOrderStatus(orderId, status);
        req.flash('success', 'Order status updated successfully!');
    } catch (error) {
        console.error('Error updating order status:', error);
        req.flash('error', 'Error updating order status. Please try again.');
    }

    res.redirect('/admin/orders');
});

/**
 * GET /admin/messages - View all contact messages
 */
router.get('/messages', async (req, res) => {
    const messages = await getAllContactMessages();
    res.render('admin/messages', {
        title: 'Contact Messages',
        messages
    });
});

/**
 * POST /admin/messages/:id/status - Update message status
 */
router.post('/messages/:id/status', async (req, res) => {
    const messageId = parseInt(req.params.id);
    const { status } = req.body;

    try {
        await updateMessageStatus(messageId, status);
        req.flash('success', 'Message status updated successfully!');
    } catch (error) {
        console.error('Error updating message status:', error);
        req.flash('error', 'Error updating message status. Please try again.');
    }

    res.redirect('/admin/messages');
});

/**
 * GET /admin/reviews - View all reviews
 */
router.get('/reviews', async (req, res) => {
    const reviews = await getAllReviews();
    res.render('admin/reviews', {
        title: 'Manage Reviews',
        reviews
    });
});

/**
 * POST /admin/reviews/:id/delete - Delete review
 */
router.post('/reviews/:id/delete', async (req, res) => {
    const reviewId = parseInt(req.params.id);

    try {
        await deleteReview(reviewId);
        req.flash('success', 'Review deleted successfully!');
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'Error deleting review. Please try again.');
    }

    res.redirect('/admin/reviews');
});

export default router;