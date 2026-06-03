import { Router } from 'express';
import { getAllReviews, getReviewById, updateReview, saveReviewResponse } from '../../models/productTester/productTester.js';
import { requireLogin, requireRole } from '../../middleware/auth.js';

const router = Router();

// Apply requireLogin and requireRole to all product tester routes
router.use(requireLogin);
router.use(requireRole('employee'));

/**
 * GET /producttesterdashboard - Dashboard overview
 */
router.get('/', async (req, res) => {
    const reviews = await getAllReviews();
    res.render('productTester/index', {
        title: 'Product Tester Dashboard',
        reviews : reviews
    });
});

/**
 * GET /producttesterdashboard/reviews - View all reviews
 */
router.get('/reviews', async (req, res) => {
    const reviews = await getAllReviews();
    res.render('productTester/reviews', {
        title: 'Manage Reviews',
        reviews : reviews
    });
});

/**
 * GET /producttesterdashboard/reviews/:id/edit - Edit own review
 */
router.get('/reviews/:id/edit', async (req, res) => {
    const reviewId = parseInt(req.params.id);
    const review = await getReviewById(reviewId);

    if (!review) {
        req.flash('error', 'Review not found.');
        return res.redirect('/producttesterdashboard/reviews');
    }

    // Only allow editing own reviews
    if (review.reviewer_id !== req.session.user.id) {
        req.flash('error', 'You can only edit your own reviews.');
        return res.redirect('/producttesterdashboard/reviews');
    }

    res.render('reviews/edit', {
        title: 'Edit Review',
        review: review
    });
});

/**
 * POST /producttesterdashboard/reviews/:id/edit - Process edit review
 */
router.post('/reviews/:id/edit', async (req, res) => {
    const reviewId = parseInt(req.params.id);
    const { rating, reviewText } = req.body;
    const review = await getReviewById(reviewId);

    if (!review) {
        req.flash('error', 'Review not found.');
        return res.redirect('/producttesterdashboard/reviews');
    }

    // Only allow editing own reviews
    if (review.reviewer_id !== req.session.user.id) {
        req.flash('error', 'You can only edit your own reviews.');
        return res.redirect('/producttesterdashboard/reviews');
    }

    try {
        await updateReview(reviewId, rating, reviewText);
        req.flash('success', 'Review updated successfully!');
        res.redirect('/producttesterdashboard/reviews');
    } catch (error) {
        console.error('Error updating review:', error);
        req.flash('error', 'Error updating review. Please try again.');
        res.redirect(`/producttesterdashboard/reviews/${reviewId}/edit`);
    }
});

/**
 * POST /producttesterdashboard/reviews/:id/respond - Respond to a review
 */
router.post('/reviews/:id/respond', async (req, res) => {
    const reviewId = parseInt(req.params.id);
    const { responseText } = req.body;
    const responderId = req.session.user.id;

    if (!responseText) {
        req.flash('error', 'Response text is required.');
        return res.redirect('/producttesterdashboard/reviews');
    }

    try {
        await saveReviewResponse(reviewId, responderId, responseText);
        req.flash('success', 'Response added successfully!');
        res.redirect('/producttesterdashboard/reviews');
    } catch (error) {
        console.error('Error saving response:', error);
        req.flash('error', 'Error saving response. Please try again.');
        res.redirect('/producttesterdashboard/reviews');
    }
});

export default router;