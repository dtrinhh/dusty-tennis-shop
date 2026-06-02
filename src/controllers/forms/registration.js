import { Router } from 'express';
import bcrypt from 'bcrypt';
import { emailExists, saveUser } from '../../models/forms/registration.js';

const router = Router();

/**
 * Display the registration form.
 */
const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

/**
 * Process registration form submission.
 */
const processRegistration = async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/register');
    }

    try {
        const exists = await emailExists(email);

        if (exists) {
            req.flash('error', 'An account with this email already exists.');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await saveUser(name, email, hashedPassword);

        req.flash('success', 'Account created successfully!');
        return res.redirect('/login');

    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'An error occurred. Please try again.');
        return res.redirect('/register');
    }
};

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Process registration form submission with validation
 */
router.post('/', processRegistration);

export default router;