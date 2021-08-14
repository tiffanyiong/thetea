const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Product = require('../models/product');
const Cart = require('../models/cart');
const { isLoggedIn } = require('../middleware');

// const cart = require('../models/cart');

const shopController = require('../controllers/shopcontroller');
const { find } = require('../models/product');

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

router.route('/shop/:id')
    .get(catchAsync(shopController.renderShopProduct))
   

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

router.route('/additem')
    .post(catchAsync(shopController.addProductToCart));


router.get('/cart', async (req, res) => {
    let cart = null;
    // const product = await Product.find({});
    if(typeof req.session.cart != "undefined"){
        cart = await Cart.findById(req.session.cart._id)
            .populate('cart.items.productId')//this is correct.
            .then(populatedCart => {
                res.render('cart', { cart: populatedCart.cart });
                
            });
            
         
        // console.log(cart.populated('cart.items.productId')); //return objectId
        // console.log(cart.cart.items.productId[0].name);
        
        
    } else {
        res.render('cart', { cart });
    }
  
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


module.exports = router;