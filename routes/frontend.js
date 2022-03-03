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
router.get('/thankyou', (req, res) => {
    res.render('thankyou');
})

router.route('/shop/:id')
    .get(catchAsync(shopController.renderShopProduct));
   
router.route('/shop/:id/add-cart')
    //product_detail.ejs 
    //after added to cart then redirect back to the shop id
    .post(catchAsync(shopController.addProductToCart));

router.get('/contact', (req, res) => {
    res.render('contact');
})

router.get('/account', isLoggedIn, (req, res) => {
    res.render('account');
})


router.route('/add-to-cart')
    .post(catchAsync(shopController.addToCart));



router.route('/cart')
    .get(catchAsync(shopController.renderCart));


router.route('/cart/:id')
    .get(catchAsync(shopController.updateCart));

router.route('/:id/checkout')
    .get(catchAsync(shopController.renderOrder));

router.route('/:id/checkout/promocode')
    .post(catchAsync(shopController.applyPromocode));

router.route('/:id/checkout/shipping_method')
    .get(catchAsync(shopController.renderOrderShippingMethod))
    .post(catchAsync(shopController.updateOrder));

router.route('/:id/checkout/payment')
    .get(catchAsync(shopController.renderPayment))
    .post(catchAsync(shopController.createPaymentIntent));

router.delete('/delete-item', async (req, res) => {
    console.log("Fronted.js------delete Item is used")
    const cart = await Cart.findById(req.session.cart._id);
    await cart.deleteFromCart(req.body.product);
    //  res.status(204).send();  
    // res.redirect('/cart');
    res.redirect(req.get('referer'));

});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


module.exports = router;