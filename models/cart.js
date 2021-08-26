const mongoose = require('mongoose');
const Product = require('./product');
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
        promocode: {
            type: mongoose.Types.ObjectId,
            ref: 'Promocode'
        },
        qty_total: Number,
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
    if(!cart.qty_total){
        cart.qty_total = 0;
    }
   cart.qty_total += 1;
   console.log("cart qty total", cart.qty_total)

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
    if(!cart.qty_total){
        cart.qty_total = 0;
    }
    cart.qty_total +=qty; //no matter what, it will only plus one
    cart.subTotal += product_total;
    console.log("qty_total", cart.qty_total);
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
          
        } else if (product.onsale == "false"){
            product_total = product.qty * product.price;
            cart.subTotal -= product_total;
          
        }
        cart.qty_total -= product.qty;
        
        console.log("--------------------------it's saving---------deleting")
       
        return this.save();
    }


}

cartSchema.methods.addOneProductQty = async function (productid) {
    console.log('======= add One Product Qty is running...============');
    let cart = this.cart;
    let new_qty;
   
    const isExisting = cart.items.findIndex(objInItems =>
         new String(objInItems.productId).trim() === new String(productid).trim());
        
         if (isExisting >= 0){
           cart.items[isExisting].qty += 1;
           console.log("cart item qty: ", cart.items[isExisting].qty );     
         }
         new_qty = cart.items[isExisting].qty;
         console.log("new qty: ", new_qty);

         const product = await Product.findById(productid);
         console.log("====product is===== ", product);
         if(product.onsale){
            cart.subTotal += product.saleprice;

        } else {
            cart.subTotal += product.price;
            // console.log("subtotal - original price = ", product_total, ' - ', product.price);
        }
        cart.qty_total += 1;
        console.log("qty_total: " , cart.qty_total);
    return this.save();

}

cartSchema.methods.removeOneProductQty = async function (productid) {
    console.log('======= remove One Product Qty is running...============');
    let cart = this.cart;
    let product_total = 0;
    let new_qty;
   
    const isExisting = cart.items.findIndex(objInItems =>
         new String(objInItems.productId).trim() === new String(productid).trim());
         const product = await Product.findById(productid);

         if (isExisting >= 0 && cart.items[isExisting].qty > 1){
            cart.items[isExisting].qty--;

         } else {
            cart.items.splice(isExisting, 1);
         }
         if(product.onsale ){
                
            cart.subTotal -= product.saleprice;
            console.log("subtotal ----> saleprice = ", cart.subTotal);
        } else  {
            cart.subTotal -= product.price;
            console.log("subtotal: ", cart.subTotal, "product old price total: ", product_total);
        } 
        cart.qty_total -= 1;
        console.log("qty_total: " , cart.qty_total);
   
    return this.save();
}

module.exports = mongoose.model('Cart', cartSchema);