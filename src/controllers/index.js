import { getNewestStrings, getRandomStrings } from "../models/product/products.js";

// Route handlers for static pages
const homePage = async (req, res) => {
    const newestStrings = await getNewestStrings(3);
    const randomStrings = await getRandomStrings(3);

    res.render('home', { 
        title: 'Home',
        newestStrings: newestStrings,
        randomStrings: randomStrings
    });
};
const aboutPage = (req, res) => {
    res.render('about', {
        title: 'About' });
};

export { homePage, aboutPage };