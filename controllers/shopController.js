
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
        await createCart.addToCart(product);
        // res.redirect('/shop');
        // res.status(204).send();
        res.redirect(req.get('referer'));
    } else {
        //add to cart if I have a req.session.cart
        console.log("I have req.session.cart-------(2)");
        const currentCart = await Cart.findById(req.session.cart._id)
        console.log(currentCart);
        await currentCart.addToCart(product);
        // res.redirect('/shop');
        // res.status(204).send();
        res.redirect(req.get('referer'));
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
        await createCart.addProductToCart(product, Number(req.body.product.qty));
        res.redirect(`/shop/${product._id}`);
    } else {
        //add to cart if I have a req.session.cart
        console.log("I have req.session.cart-------(2)");
        const currentCart = await Cart.findById(req.session.cart._id)
        console.log(currentCart);
        //String to Number 只能在這裡改，不能在Model 裡面改
       await currentCart.addProductToCart(product, Number(req.body.product.qty));
        res.redirect(`/shop/${product._id}`);
    }
   console.log("method is used: ")
}

module.exports.renderCart =  async (req, res) => {
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
  
};

module.exports.updateCart = async (req, res) => {
    let cart = null;
    let action = req.query.action;

    // // const product = await Product.find({});
    if(typeof req.session.cart != "undefined"){
        cart = await Cart.findById(req.session.cart._id);
        await cart.populate('cart.items.productId').execPopulate();

        const product_id = req.params.id; //product's id
        const product = await Product.findById(product_id);

        switch (action){
            case "add":
                console.log("--------req. params :", product_id);
                console.log("------- product---- params :", product);
                await cart.addOneProductQty(product);
                break;
            case "remove":
                await cart.removeOneProductQty(product);
                break;
            default:
                console.log("You got update problems!!! ");
                break;
        }

    res.redirect('/cart');
    }// end if
};



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