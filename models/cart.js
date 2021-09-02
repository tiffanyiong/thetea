const mongoose = require('mongoose');
const Product = require('./product');
const Promocode = require('./promocode');
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
        promocodes: [{
            promocodeId: {
                type: mongoose.Types.ObjectId,
                ref: 'Promocode'
            }
        }],
        discount: {
            type: Number,
            default: 0
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

cartSchema.methods.addPromocodeToCart = async function(coupon, req) {

let cart = this.cart;

 
const isExisting = cart.promocodes.findIndex(objInCode =>
    new String(objInCode.promocodeId).trim() === new String(coupon[0]._id).trim());
    let newTotal = 0;
    if(isExisting >=0 && coupon[0].is_active == true && coupon[0].max_use > 0 && cart.subTotal >= coupon[0].subtotal_min ){
        //有在車裡且可以用

        console.log("its already in the cart and it can be used! ");
        req.flash('error', 'A Coupon is already applied');
    } else if (isExisting < 0 && coupon[0].is_active == true && coupon[0].max_use > 0 && this.cart.subTotal >= coupon[0].subtotal_min) {
     //沒有在車裡但可以用

     console.log("trying to push to cart", coupon[0].code)
     cart.promocodes.push({promocodeId: coupon[0]._id})

     if(coupon[0].discount_amount > 0 && coupon[0].discount_percent == 1) {
 
         cart.subTotal -= coupon[0].discount_amount;
         cart.discount = coupon[0].discount_amount;
     } else if (coupon[0].discount_amount == 0 && coupon[0].discount_percent < 1 || coupon[0].discount_amount == null && coupon[0].discount_percent < 1){

        newTotal =  cart.subTotal * coupon[0].discount_percent;
        cart.discount = Number.parseFloat(cart.subTotal - newTotal).toFixed(2);
        cart.subTotal = Number.parseFloat(newTotal).toFixed(2);
     }

     console.log("successfully added to cart:", cart)
     req.flash('success', 'Coupon is successfully applied');
    } else if (cart.promocodes.length > 0 && isExisting < 0){
        console.log("已有一個code 不能加了");
        req.flash('error', 'a coupon is already applied');
    }else {
        console.log(" 不能加了")
        req.flash('error', 'Coupon is invalid');
    }
  
return this.save();

}

module.exports = mongoose.model('Cart', cartSchema);