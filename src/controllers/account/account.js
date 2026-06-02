import { Router } from 'express';
import { getOrdersByUserId, getReviewsByUserId } from '../../models/account/account.js';
import { requireLogin } from '../../middleware/auth.js';

const router = Router();

/**
 * Display the account profile, order history, and reviews made by user
 */
const showAccountPage = async (req, res) => {
    const user = req.session.user;
    const orders = await getOrdersByUserId(user.id);
    const reviews = await getReviewsByUserId(user.id);

    res.render('account/index', {
        title: 'My Account',
        user : user,
        orders : orders,
        reviews : reviews
    });
};

/**
 * GET /account - Display the account page
 */
router.get('/', requireLogin, showAccountPage);

export default router;