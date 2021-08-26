const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    order_info: {
        orderNumber: {
            type: Number,
            required: true
        },
        order_status: {
            type: String,
            default: "pending"
        },
        shippingFee: {
            type: Number,
            require: true
        },
        total: {
            type: Number,
            require: true
        },
        cartItems: {
            type: mongoose.Types.ObjectId,
            ref: 'Cart',
            required: true
        },
        payment_method:{
            type: String
        },
        order_date: {
            type: Date,
            require: true
        }
        

    },
    contact_info: {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone_num: {
            type: Number,
            required: true
        },
        address_info: {
           address: String,
           address_optional: String,
           region: String
        },
        is_pickup: {
            type: Boolean,
            default: false
        }
    }


  
});

module.exports = mongoose.model('Order', orderSchema);