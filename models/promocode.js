const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const promoSchema = new Schema({
   
        code: {
            type: String,
            require: true
        },
        description:{
            type: String
        },
        discount_percent: {
            type: Number,
            default: 1
        },
        discount_amount: {
            type: Number,
            default: 0
        },
        max_use: {
            type: Number,
            default: 10000
        },
        assigned_num: {
            type: Number,
            default: 0
        },
        is_active: {
            type: Boolean
        },
        subtotal_min: {
            type: Number,
            default:0
        }


   
});

module.exports = mongoose.model('Promocode', promoSchema);