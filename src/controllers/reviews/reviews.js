import { getReviewsByStringId, getAverageRating, saveReview } from '../../models/reviews/reviews.js';

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

export { processReview };