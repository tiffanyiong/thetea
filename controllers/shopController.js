
const Product = require('../models/product');
const Cart = require('../models/cart');
const Users = require('../models/user');
const categories = ['Bestseller', 'Popular','Other'];

module.exports.addToCart = async (req, res, next) =>{

// Cart.save(addedProduct);
// req.user.addToCart(product) // we are using user(object)
//object to call a method use instance method

const product = await Product.findById(req.body.product.id);

if(req.session.hasOwnProperty('passport')){ //see if it's logged in 
    const loggedUsername = req.session.passport.user;
    // find user's cart first 
   //push to user.cart eventually
} else{ //if its not logged in, then check req.cart is null, yes? create, not check = length
 
    if(typeof req.session.cart == "undefined") {
        console.log("req.session.cart is undefined-----(1)");
        req.session.cart = await new Cart({});
        let createCart = req.session.cart;
        createCart.addToCart(product);
    } else {
        //add to cart if I have a req.session.cart
        console.log("I have req.session.cart-------(2)");
        const currentCart = await Cart.findById(req.session.cart._id)
        console.log(currentCart);
        currentCart.addToCart(product);
        

    }
    



// const cart = await new Cart({});
// let cart = req.session.cart = [];
// const product = await Product.findById(req.body.product.id);
// console.log("=====================call Cart.saveToCart right now: ");
// cart.addToCart(product);


res.send(req.session.cart);

};
}
