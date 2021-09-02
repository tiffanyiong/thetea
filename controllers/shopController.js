
const Product = require('../models/product');
const Cart = require('../models/cart');
const Users = require('../models/user');
const { find, findById } = require('../models/product');
const promocode = require('../models/promocode');
const categories = ['Bestseller', 'Popular','Other'];
const Order = require('../models/order');
const orderid = require('order-id')('mysecret');

const Regions = ["Hong Kong Island", "Kowloon", "New Terriories"]

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
    let action = req.query.action;
    // const product = await Product.find({});
    if(typeof req.session.cart != "undefined"){
        cart = await Cart.findById(req.session.cart._id)
            .populate('cart.items.productId')//this is correct.
            .populate('cart.promocode')
            .then(populatedCart => {
                res.render('cart', { cart: populatedCart.cart, cartId: populatedCart}); //CartId for Order
           
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

module.exports.applyPromocode = async (req, res) => {
    
    const promo_code = await promocode.find({code : req.body.promocode});
    if(promo_code.length <= 0){ // can't find the promo
        console.log("length: ", promo_code.length)
        req.flash('error', 'Coupon is invalid');
    } else {
        const currentCart = await Cart.findById(req.session.cart._id)
        await currentCart.addPromocodeToCart(promo_code, req);
        const order = await Order.findById(req.session.order._id);
        order.addPromocodeToOrder(promo_code);
      console.log("successfully add promocode to order");
    }
   

    console.log("shop 裡加的：",promo_code)
    res.redirect(`/${req.session.cart._id}/checkout`);
   
}

module.exports.renderOrder = async (req, res) => {
//need to create order first
const orderNum = orderid.generate();
// 1. I can't find in the session, then create one
// 2. found: a) order not completed, then show the value
//    found: b) order completed, then new order

if(typeof req.session.order == "undefined") { // doesn't have order
    req.session.order = new Order({"order_info.orderNumber": orderNum});
     await req.session.order.save();
     console.log("----------new order:", req.session)
 
    } else if (typeof req.session.order != "undefined" &&  req.session.order.order_info.is_placed_success){
        //I found the order and it's already placed, the customer wants to create more order~
        req.session.order = new Order({"order_info.orderNumber": orderNum});
        await req.session.order.save();
           
         console.log("-------another---new order:", req.session)
    } else { 
        console.log("------need to check if I have placed an order, will it creates a new one later")
    }

    const order = await Order.findById(req.session.order._id);
 
    const cart = await Cart.findById(req.params.id)
        .populate('cart.items.productId')//this is correct.
        .populate('cart.promocodes.promocodeId')
        .then(populatedCart => {
        res.render('checkout', { cart: populatedCart.cart, cartId: populatedCart, Regions, order});
          })
       
    
}






module.exports.updateOrder = async (req, res) => {
    const orderId = req.body.orderid; // the req.body from check out route
    const cartId = req.session.cart._id;
  
    let action = req.query.action;
        switch(action){
           case "addShipping":
               
                const addShipping = await Order.findByIdAndUpdate(req.session.order._id,
                    { "shipping_info.shipping_method": req.body.shipping_info.shipping_method,
                      "shipping_info.shipping_fee":  req.body.shipping_info.shipping_fee,
                      "order_info.customer_note":  req.body.order_info.customer_note
                    }
                     ,{new: true} )
                const calculate_total = await Order.findById(req.session.order._id);
                await calculate_total.addShippingToTotal(calculate_total.shipping_info.shipping_fee);
            
             res.send(req.body)
               break;
            case "addContact": // the req.body is from checkout route
                console.log("adding contact info");
                console.log("req body", req.body)
                const updateOrder = await Order.findByIdAndUpdate(orderId,{...req.body} ,{new: true} )
                res.redirect(`/${cartId}/checkout/shipping_method`)
                break;
            default:
                console.log("something went wrong");
                res.send("something went wrong ah")
                break;      

    }
    // res.send("this is not using switch case")
   
}

module.exports.renderOrderShippingMethod = async (req, res) => {
    const order = await Order.findById(req.session.order._id);
    const cart = await Cart.findById(req.session.cart._id)
        .populate('cart.items.productId')//this is correct.
        .populate('cart.promocodes.promocodeId')
        .then(populatedCart => {
        res.render('shipping_method', { cart: populatedCart.cart, cartId: populatedCart, Regions, order});
        })
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