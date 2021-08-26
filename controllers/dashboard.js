const Product = require('../models/product');
const Users = require('../models/user');
const Promocode = require('../models/promocode');
const categories = ['Bestseller', 'Popular','Other'];
const { cloudinary } = require("../cloudinary");
const { findById } = require('../models/product');

module.exports.index = async (req, res) =>{
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    } 
    res.render('backend/dashboard');  
};

module.exports.renderProduct = async (req, res) =>{
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    } 
    const products = await Product.find({});
    res.render('backend/product', { products });
};

module.exports.renderNewProductForm = async (req, res) => {
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    } 
    res.render('backend/product_new', { categories }); 
};

module.exports.addNewProduct = async (req, res, next) => { //used catchAsync 
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/login');
    }     
    if(!req.body.product) throw new ExpressError('Invalid Product Data', 400); //400 invalid client status code
      
        const product = new Product(req.body.product);
        product.image = req.files.map(forimage => ({url:forimage.path, filename:forimage.filename}));
        await product.save();
        req.flash('success', 'Successfully add a product!')
        console.log(product);
        res.redirect(`/dashboard/product/${product._id}`)
   
};

module.exports.showSingleProduct = async (req, res) => {
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    } 
    const product = await Product.findById(req.params.id);
    res.render('backend/singleproduct',{ product });
};

module.exports.renderEditProductForm = async (req, res) =>{
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    } 
    const product = await Product.findById(req.params.id);
    res.render('backend/edit',{ product, categories });
};

module.exports.editProduct = async (req, res) =>{
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    } 
    if(!req.body.product) throw new ExpressError('Invalid Product Data', 400);
    const { id } = req.params;
    //split the object (we ground things like Product[name])
    const product = await Product.findByIdAndUpdate(id, {...req.body.product }, {new: true})
    const imgs = req.files.map(forimage => ({url:forimage.path, filename:forimage.filename}));
    product.image.push(...imgs);
    await product.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
       console.log(req.body.deleteImages)
        await product.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully made changes!')
    res.redirect(`/dashboard/product/${product._id}/`);

};

module.exports.deleteProduct = async (req, res) => {
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    } 
    const { id } = req.params;  
    const product = await Product.findById(req.params.id);
    
    var filenames = []
    product.image.forEach((f) => {
        filenames.push(f['filename'])
    })
    for(let i = 0; i < filenames.length; i++){
        await cloudinary.uploader.destroy(filenames[i]);
    }
    
    await Product.findByIdAndDelete(id);
    console.log("----------------delete----------------")
   
    res.redirect('/dashboard/product');
  
};

module.exports.renderUser = async (req, res) => {
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    } 
    const users = await Users.find({});
    res.render('backend/user_list', { users })
};

module.exports.renderPromo = async (req, res) => {
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    }     
    const promocodes = await Promocode.find({})
    res.render('backend/promocode', { promocodes })
}

module.exports.renderPromoNew = async (req, res) => {
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    }     

    res.render('backend/promo_new')

}

module.exports.addNewPromoCode = async (req, res) => {
    const promocode = new Promocode(req.body.promocode);
    await promocode.save()
    req.flash('success', 'Successfully add a promocode !')
    res.redirect('/dashboard/promocode');
}

module.exports.renderPromoSingle = async (req, res) => {
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    }     

    const promocode = await Promocode.findById(req.params.id);
    res.render('backend/promo_single',{ promocode } )
  
}

module.exports.renderEditPromocode = async (req, res) => {
    if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    }     
    const promocode = await Promocode.findById(req.params.id);
    res.render('backend/promo_edit', { promocode })
}

module.exports.editPromocode = async (req, res) => {

    /*******
     * eidt : promocode
     */

     if(req.user.role != process.env.DASHBOARD_ACCESS){
        req.flash('error', 'Sorry, you do not have access to the page');
        res.redirect('/');
    } 
    if(!req.body.promocode) throw new ExpressError('Invalid Product Data', 400);

    const { id } = req.params;
    //split the object (we ground things like Product[name])
    const promocode = await Promocode.findByIdAndUpdate(id, {...req.body.promocode }, {new: true})
    await promocode.save();

    req.flash('success', 'Successfully made changes!')
    res.redirect(`/dashboard/promocode/${promocode._id}/`);
}