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


const dashboard = require('../controllers/dashboard');


router.get('/', isLoggedIn, catchAsync (dashboard.index));
router.get('/product/new', isLoggedIn, catchAsync(dashboard.renderNewProductForm));

router.route('/product')
    .get(isLoggedIn, catchAsync (dashboard.renderProduct))
    .post(isLoggedIn, upload.array('image'),catchAsync (dashboard.addNewProduct));
   

router.route('/product/:id')
    .get(isLoggedIn, catchAsync (dashboard.showSingleProduct))
    .put(isLoggedIn, upload.array('image'),catchAsync (dashboard.editProduct))
    .delete(isLoggedIn, catchAsync (dashboard.deleteProduct));



router.get('/product/:id/edit', isLoggedIn, catchAsync(dashboard.renderEditProductForm));

router.get('/user', isLoggedIn, catchAsync(dashboard.renderUser));


router.get('/logout', (req, res) => {
    
    req.logout();
    res.redirect('/');
})

module.exports = router;