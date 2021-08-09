const express = require('express');
const router = express.Router();
const Product = require('../models/product');
// const Cart = require('../models/cart');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const { isLoggedIn } = require('../middleware');

const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });
//usefor
//if you add more categories, please remember add this in this array
const Users = require('../models/user');
const categories = ['Bestseller', 'Popular','Other'];
const dashboard = require('../controllers/dashboard');


router.get('/', isLoggedIn, catchAsync (dashboard.index));

router.get('/product',isLoggedIn, catchAsync (dashboard.renderProduct));

router.get('/product/new', isLoggedIn, catchAsync(dashboard.renderNewProductForm));

router.post('/product', isLoggedIn, catchAsync (dashboard.addNewProduct));

router.get('/product/:id', isLoggedIn, catchAsync (dashboard.showSingleProduct));

router.get('/product/:id/edit', isLoggedIn, catchAsync (dashboard.renderEditProductForm));

router.put('/product/:id', isLoggedIn, catchAsync (dashboard.editProduct));

router.delete('/product/:id', isLoggedIn, catchAsync (dashboard.deleteProduct));

router.get('/user', isLoggedIn, catchAsync(dashboard.renderUser))


router.get('/logout', (req, res) => {
    
    req.logout();
    res.redirect('/');
})

module.exports = router;