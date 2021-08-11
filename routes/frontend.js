const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Product = require('../models/product');
const Cart = require('../models/cart');
const { isLoggedIn } = require('../middleware');
// const cart = require('../models/cart');

const shopController = require('../controllers/shopcontroller');

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/shop', async (req, res) => {
    const products = await Product.find({});
    res.render('shop', { products });
})

router.get('/shop/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('product_detail', { product });
})

router.get('/contact', (req, res) => {
    res.render('contact');
})

router.get('/account', isLoggedIn, (req, res) => {
    res.render('account');
})

router.get('/checkout', (req, res) => {
    res.render('checkout');
})


router.route('/add-to-cart')
    .post(catchAsync(shopController.addToCart));



router.get('/cart', (req, res) => {
    res.render('cart');
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


module.exports = router;