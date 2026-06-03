import { getReviewsByStringId, getAverageRating, saveReview, deleteReview, updateReview, getReviewById } from '../../models/reviews/reviews.js';

/**
 * Process a new review submission
 */
const processReview = async (req, res) => {
    const stringId = parseInt(req.params.id);
    const { rating, reviewText } = req.body;
    const reviewerId = req.session.user.id;

    await saveReview(stringId, reviewerId, rating, reviewText);

    res.redirect(`/products/${stringId}`);
};

/**
 * Process review edit
 */
const processEditReview = async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const { rating, reviewText } = req.body;
    const review = await getReviewById(reviewId);

    if (!review) {
        req.flash('error', 'Review not found.');
        return res.redirect('/account');
    }

    // Only allow editing own reviews
    if (review.reviewer_id !== req.session.user.id) {
        req.flash('error', 'You can only edit your own reviews.');
        return res.redirect('/account');
    }

    await updateReview(reviewId, rating, reviewText);
    req.flash('success', 'Review updated successfully!');
    res.redirect(`/products/${review.string_id}`);
};

/**
 * Process review deletion
 */
const processDeleteReview = async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const review = await getReviewById(reviewId);

    if (!review) {
        req.flash('error', 'Review not found.');
        return res.redirect('/account');
    }

    // Allow delete if own review or admin
    if (review.reviewer_id !== req.session.user.id && req.session.user.roleName !== 'admin') {
        req.flash('error', 'You do not have permission to delete this review.');
        return res.redirect('/account');
    }

    await deleteReview(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/products/${review.string_id}`);
};

/**
 * Show edit review form
 */
const showEditReviewForm = async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const review = await getReviewById(reviewId);

    if (!review) {
        req.flash('error', 'Review not found.');
        return res.redirect('/account');
    }

    // Only allow editing own reviews
    if (review.reviewer_id !== req.session.user.id) {
        req.flash('error', 'You can only edit your own reviews.');
        return res.redirect('/account');
    }

    res.render('reviews/edit', {
        title: 'Edit Review',
        review
    });
};
export { processReview, processEditReview, processDeleteReview, showEditReviewForm };