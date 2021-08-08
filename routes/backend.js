const express = require('express');
const router = express.Router();
const Product = require('../models/product');
// const Cart = require('../models/cart');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
//usefor
//if you add more categories, please remember add this in this array
const categories = ['Bestseller', 'Popular','Other'];
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.get('/', (req, res) =>{
    res.render('backend/dashboard');
})
router.get('/product', async (req, res) =>{
    const products = await Product.find({});
    res.render('backend/product', { products});
})

router.get('/product/new', (req, res) => {
    res.render('backend/product_new', { categories }); 
})

router.post('/product', catchAsync (async (req, res, next) => { //used catchAsync 
        if(!req.body.product) throw new ExpressError('Invalid Product Data', 400); //400 invalid client status code
        // const productSchema = Joi.object({
        //     product: Joi.object({
        //         name: Joi.string().required(),
        //         price: Joi.number().required().positive().min(0)
        //         // saleprice: Joi.number().allow(0),
        //         // qty: Joi.number().allow(''),
        //         // category: Joi.string().allow(''),
        //         // flavor: Joi.string().allow(''),
        //         // onsale: Joi.boolean(),
        //         // description: Joi.string().allow('')
        //     }).required()
        // })
        // const { error } = productSchema.validate(req.body);
        // if (error){
        //     const msg = error.details.map(el => el.message).join(',')
        //     throw new ExpressError(msg, 400)
        // }

        const product = new Product(req.body.product);
        await product.save();
        req.flash('success', 'Successfully add a product!')
        console.log("attemped add data")
        res.redirect(`/dashboard/product/${product._id}`)
   
}));

router.get('/product/:id', catchAsync (async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('backend/singleproduct',{ product });
}))

router.get('/product/:id/edit', catchAsync (async (req, res) =>{
    
    const product = await Product.findById(req.params.id);
    res.render('backend/edit',{ product, categories });
}));

router.put('/product/:id', catchAsync (async (req, res) =>{
    if(!req.body.product) throw new ExpressError('Invalid Product Data', 400);
    const { id } = req.params;
    //split the object (we ground things like Product[name])
    const product = await Product.findByIdAndUpdate(id, {...req.body.product }, {new: true})
    req.flash('success', 'Successfully made changes!')
    res.redirect(`/dashboard/product/${product._id}/`);

}));

router.delete('/product/:id', catchAsync (async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    console.log("----delete----")
    res.redirect('/product');
}));

module.exports = router;