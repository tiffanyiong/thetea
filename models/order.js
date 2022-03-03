const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    order_info: {
        orderNumber: {
            type: String
           
        },
        status: {
            type: String,
            default: "pending"
        },
      
        total: {
            type: Number
            
        },
        final_total:{
            type: Number,
            default: 0
        },
        cartId: {
            type: mongoose.Types.ObjectId,
            ref: 'Cart'
        },
        payment_method:{
            type: String
        },
        orderCreateDate: {
            type: Date,
            default: Date.now
        },
        is_pickup: {
            type: Boolean,
            default: false
        },
        is_shipped:{
            type: Boolean,
            default: false
        },
        is_placed_success:{
            type: Boolean,
            default: false
        },
        promocodes: [{
            promocodeId: {
                type: mongoose.Types.ObjectId,
                ref: 'Promocode',
                default: 0
            }
        }],
        is_paid:{
            type: Boolean,
            default: false
        },
        customer_note: String
        

    },
    contact_info:{
        email: {
            type: String
           
        },
        phone: {
            type: Number
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    },
    shipping_info: {
       
        first_name: {
            type: String
        },
        last_name: {
            type: String
        },
        address: String,
        address_optional: String,
        district: String,
        region: String,
        shipping_fee: {
            type: Number,
           
        },
        shipping_method:{
            type: String
        },
        
    }


  
});

orderSchema.methods.addShippingToTotal = async function(fee) {
let order_info = this.order_info;
order_info.final_total = order_info.total + fee;
console.log("successfully add to order total !:) ")
console.log("-------------the order total now is : ", order_info.final_total )
return this.save()
}

orderSchema.methods.placeOrderStatus = async function(){
    let order_info = this.order_info;
    order_info.is_placed_success = true;
    if(order_info.is_placed_success){
        console.log("already change the is_placed_success");
      
    } else {
        console.log("didn't change is_placed_success to true");
    }
    return this.save();
}


module.exports = mongoose.model('Order', orderSchema);