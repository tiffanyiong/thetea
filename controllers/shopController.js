
const Product = require('../models/product');
const Cart = require('../models/cart');
const Users = require('../models/user');
const { find } = require('../models/product');
const categories = ['Bestseller', 'Popular','Other'];

module.exports.addToCart = async (req, res, next) =>{

    //session cart  vs  loggedin - userCart： 
    /* 
      1. As long as I login, I use userCart
      2. Not login , use session cart
      3. unless at Checkout page: "ask to sign in to account, 
                                    then push session cart to UserCart"
    */
    const product = await Product.findById(req.body.product.id);

    if(typeof req.session.cart == "undefined") {
        console.log("req.session.cart is undefined-----(1)");
        req.session.cart = await new Cart({});
        let createCart = req.session.cart;
        createCart.addToCart(product);
        res.send(createCart);
    } else {
        //add to cart if I have a req.session.cart
        console.log("I have req.session.cart-------(2)");
        const currentCart = await Cart.findById(req.session.cart._id)
        console.log(currentCart);
        currentCart.addToCart(product);
        res.send(currentCart);
    }

};

module.exports.renderShopProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('product_detail', { product });
};

module.exports.addProductToCart = async (req, res) => {
    const product = await Product.findById(req.body.product.id);

    if(typeof req.session.cart == "undefined") {
        console.log("req.session.cart is undefined-----(1)");
        req.session.cart = await new Cart({});
        let createCart = req.session.cart;
        createCart.addProductToCart(product, Number(req.body.product.qty));
        res.send(createCart);
    } else {
        //add to cart if I have a req.session.cart
        console.log("I have req.session.cart-------(2)");
        const currentCart = await Cart.findById(req.session.cart._id)
        console.log(currentCart);
        //String to Number 只能在這裡改，不能在Model 裡面改
        currentCart.addProductToCart(product, Number(req.body.product.qty));
        res.send(currentCart);
    }
   console.log("method is used: ")
}

/**
 * login user Cart:
 */

    // let loggedUsername =  req.session.passport.user;
    // const product = await Product.findById(req.body.product.id);
    // if(req.session.hasOwnProperty('passport')){
    //     const loggedUser = req.user;
    //     if(req.user.carts.cartId.length > 0){
    //         const currentCart = await Cart.findById(loggedUser.carts.cartId[0]);
    //         currentCart.addToCart(product);
    //         console.log("Yes.. it save to the same cart")
    //         res.send(currentCart);

          
    //     }else {
           
    //         const userCart = await new Cart({});
    //         userCart.addToCart(product);
    //         loggedUser.pushToCart(userCart._id);
    //         console.log("successfully created new userCart")
    //         res.send(loggedUser);
    //      }

       
    // };