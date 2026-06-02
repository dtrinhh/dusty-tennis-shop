import { Router } from 'express';
import { createContactMessage } from '../../models/forms/contact.js';

const router = Router();

/**
 * Display the contact form page.
 */
const showContactForm = (req, res) => {
    res.render('forms/contact/form', {
        title: 'Contact Us'
    });
};

/**
 * Handle contact form submission.
 * If validation passes, save to database and redirect.
 * If validation fails, redirect back to form with flash message.
 */
const handleContactSubmission = async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/contact');
    }

    try {
        await createContactMessage(name, email, message);
        req.flash('success', 'Thank you for contacting us! We will get back to you soon.');
        res.redirect('/contact');
    } catch (error) {
        console.error('Error saving contact form:', error);
        req.flash('error', 'Unable to submit your message. Please try again later.');
        res.redirect('/contact');
    }
};

/**
 * GET /contact - Display the contact form
 */
router.get('/', showContactForm);

/**
 * POST /contact - Handle contact form submission
 */
router.post('/', handleContactSubmission);

export default router;