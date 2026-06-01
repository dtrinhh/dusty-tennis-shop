import { getAllStrings, getStringById } from '../../models/product/products.js';

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

        res.render('product/detail', {
            title: `${string.brand} - ${string.name}`,
            string: string
        });
};

export { productsPage, productDetailPage };