const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');
const { isLoggedIn } = require('../middleware');


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
router.get('/cart', async (req, res) => {
    const cart = await Cart.findById(req.params.id);
    res.render('cart', { cart });
})
router.post('/cart', async (req, res) => {
    // one user - 1 cart - 
    const cart = new Cart(req.body.cart);
    const item = await Cart.findById(req.params.id);
    cart.products.push(item);
    // await cart.save(item);
    console.log(cart)
    res.send(cart);
   
})


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


module.exports = router;