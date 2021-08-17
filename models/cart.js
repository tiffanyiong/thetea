const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 
const cartSchema = new Schema ({
    
    cart:{
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }],
        subTotal: Number
    }

});



//instance method
cartSchema.methods.addToCart = function(product) {
    console.log('=======we are in cart model:============');
    let cart = this.cart;
    const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(product._id).trim());
    if (isExisting >= 0){
         cart.items[isExisting].qty += 1;
      
    } else {
        cart.items.push({ productId: product._id, qty: 1});
    }
    if(!cart.subTotal) {
        cart.subTotal = 0;
    }
    if(product.onsale){
        cart.subTotal += product.saleprice;
    } else {
        cart.subTotal += product.price;
    }
    return this.save();  
  
};

cartSchema.methods.addProductToCart = function(product, qty) {
    console.log('=======we are in cart model: product + qty ============');
    let cart = this.cart;
    let product_total = 0;
    
    
    const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(product._id).trim());
    if (isExisting >= 0){    
        console.log("input qty: ", typeof qty);
        cart.items[isExisting].qty += qty;
           
    } else {
        console.log("first time to push item")
        console.log("type is: ", typeof qty);
        cart.items.push({ productId: product._id, qty});
        
    }
   
    if(product.onsale){
         product_total = qty * product.saleprice;
    } else {
         product_total = qty * product.price;
    }
    if(!cart.subTotal) {
        cart.subTotal = 0;
    }
    cart.subTotal += product_total;
   
    console.log("product total: " , product_total);
    console.log("subTotal: " , cart.subTotal)

    return this.save();  

}

cartSchema.methods.deleteFromCart = function (product) {
    console.log("Cart.js - deleteFromCart is used")
    let cart = this.cart;
    let product_total = 0;
    const isExisting = cart.items.findIndex(objInItems => new String(objInItems.productId).trim() === new String(product.id).trim());
    console.log("productID: ", product.id);
    if (isExisting >= 0){
        cart.items.splice(isExisting, 1);
        if(product.onsale == "true"){
            product_total = product.qty * product.saleprice;
            cart.subTotal -= product_total;
            // console.log("product_total: ", product_total);
            // console.log("subtotal - sale price = ", product_total, ' - ', product.saleprice);
        } else if (product.onsale == "false"){
            product_total = product.qty * product.price;
            cart.subTotal -= product_total;
            // console.log("subtotal - original price = ", product_total, ' - ', product.price);
        }
        
        console.log("--------------------------it's saving---------deleting")
        return this.save();
    }


}

module.exports = mongoose.model('Cart', cartSchema);