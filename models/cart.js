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
    console.log('=======we are in cart model============');
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
    cart.subTotal += product.price;
    return this.save();  
  
};


module.exports = mongoose.model('Cart', cartSchema);