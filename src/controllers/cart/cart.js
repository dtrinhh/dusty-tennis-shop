import { Router } from 'express';
import { getStringById } from '../../models/product/products.js';
import { createOrder } from '../../models/cart/cart.js';
import { requireLogin } from '../../middleware/auth.js';

const router = Router();

/**
 * Get/Create cart from session
 */
const getCart = (req) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    return req.session.cart;
};

/**
 * View cart
 */
router.get('/', requireLogin, (req, res) => {
    const cart = getCart(req);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.render('cart/index', {
        title: 'My Cart',
        cart,
        total: total.toFixed(2)
    });
});

/**
 * Add item to cart
 */
router.post('/add/:id', requireLogin, async (req, res) => {
    const stringId = parseInt(req.params.id);
    const string = await getStringById(stringId);

    if (!string || Object.keys(string).length === 0) {
        req.flash('error', 'Product not found.');
        return res.redirect('/products');
    }

    const cart = getCart(req);

    // Check if item already in cart
    const existingItem = cart.find(item => item.id === stringId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: string.id,
            brand: string.brand,
            name: string.name,
            price: string.price,
            quantity: 1
        });
    }

    req.session.cart = cart;
    req.flash('success', `${string.brand} ${string.name} added to cart!`);
    res.redirect(`/products/${stringId}`);
});

/**
 * Remove item from cart
 */
router.post('/remove/:id', requireLogin, (req, res) => {
    const stringId = parseInt(req.params.id);
    req.session.cart = getCart(req).filter(item => item.id !== stringId);
    req.flash('success', 'Item removed from cart.');
    res.redirect('/cart');
});

/**
 * Update item quantity
 */
router.post('/update/:id', requireLogin, (req, res) => {
    const stringId = parseInt(req.params.id);
    const quantity = parseInt(req.body.quantity);
    const cart = getCart(req);

    if (quantity <= 0) {
        req.session.cart = cart.filter(item => item.id !== stringId);
    } else {
        const item = cart.find(item => item.id === stringId);
        if (item) item.quantity = quantity;
        req.session.cart = cart;
    }

    res.redirect('/cart');
});

/**
 * Checkout page
 */
router.get('/checkout', requireLogin, (req, res) => {
    const cart = getCart(req);

    if (cart.length === 0) {
        req.flash('error', 'Your cart is empty.');
        return res.redirect('/cart');
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.render('cart/checkout', {
        title: 'Checkout',
        cart,
        total: total.toFixed(2)
    });
});

/**
 * Process checkout
 */
router.post('/checkout', requireLogin, async (req, res) => {
    const cart = getCart(req);

    if (cart.length === 0) {
        req.flash('error', 'Your cart is empty.');
        return res.redirect('/cart');
    }

    const { specialRequest } = req.body;
    const userId = req.session.user.id;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        await createOrder(userId, cart, total.toFixed(2), specialRequest);
        req.session.cart = [];
        req.flash('success', 'Order placed successfully!');
        res.redirect('/account');
    } catch (error) {
        console.error('Error placing order:', error);
        req.flash('error', 'Error placing order. Please try again.');
        res.redirect('/cart/checkout');
    }
});

export default router;