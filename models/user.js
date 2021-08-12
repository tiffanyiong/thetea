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
    carts: {
        cartId: [{
            type: mongoose.Types.ObjectId,
            ref:'Cart'
        }]
    }
    
    
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.pushToCart = function(userCartId) {
   
    this.carts.cartId.push(userCartId);
    console.log("userSchema is called", this.carts)
    return this.save();

};


module.exports = mongoose.model('User', UserSchema);