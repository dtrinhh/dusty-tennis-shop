import { Router } from 'express';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';

const router = Router();

/**
 * Display the login form.
 */
const showLoginForm = (req, res) => {
    res.render('forms/login/form', {
        title: 'User Login'
    });
};

/**
 * Process login form submission.
 */
const processLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const passwordCheck = await verifyPassword(password, user.password);

        if (!passwordCheck) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // SECURITY: Remove password from user object before storing in session
        delete user.password;

        req.session.user = user;
        req.flash('success', `Welcome back ${user.name}!`);
        return res.redirect('/');

    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred. Please try again.');
        return res.redirect('/login');
    }
};

/**
 * Handle user logout.
 */
const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    // Call destroy() to remove this session from the store (PostgreSQL in our case)
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

/**
 * GET /login - Display the login form
 */
router.get('/', showLoginForm);

/**
 * POST /login - Process login form submission
 */
router.post('/', processLogin);

export default router;
export { processLogout };