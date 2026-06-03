import { getAllStrings, getStringById } from '../../models/product/products.js';
import { getReviewsByStringId, getAverageRating } from '../../models/reviews/reviews.js';
import { getResponsesByReviewId } from '../../models/productTester/productTester.js';

/**
 * Route handler for String Products list page
 */
const productsPage = async (req, res) => {
        const sortBy = req.query.sort || 'brand';
        const strings = await getAllStrings(sortBy);

        res.render('products', {
            title: 'Our Strings',
            strings,
            sortBy
        });
};

/**
 * Route handler for individual string page
 */
const productDetailPage = async (req, res, next) => {
        const stringId = parseInt(req.params.id);
        const string = await getStringById(stringId);

        if (!string || Object.keys(string).length === 0) {
            const err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }

        const reviews = await getReviewsByStringId(stringId);
        const averageRating = await getAverageRating(stringId);

        // Get responses for each review
        const reviewsWithResponses = [];
        for (const review of reviews) {
        const responses = await getResponsesByReviewId(review.id);
        review.responses = responses;
        reviewsWithResponses.push(review);
}

        res.render('product/detail', {
            title: `${string.brand} - ${string.name}`,
            string: string,
            reviews: reviews,
            averageRating: averageRating
        });
};

export { productsPage, productDetailPage };