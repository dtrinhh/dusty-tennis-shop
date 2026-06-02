import { getNewestStrings, getRandomStrings, getStringById } from "../models/product/products.js";

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
const aboutPage = async (req, res) => {
    const favoriteString = await getStringById(5);
    
    res.render('about', {
        title: 'About',
        favoriteString: favoriteString
    });
};

export { homePage, aboutPage };