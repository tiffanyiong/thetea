const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        default: "Customer"
    },
    cart: {
        type: mongoose.Types.ObjectId,
        ref: 'Cart'
    }
    
    
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

UserSchema.methods.addToCart = function(product) {
    let cart = this.cart; // get cart from the database
    if(cart.item.lenth == 0){
        cart.items.push({productId:product._id, qty: 1})
        cart.totalPrice = product.price;
    } else {


    }
    console.log("User in schema:", this.user);
}