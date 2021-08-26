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
        },
        discount_amount: {
            type: Number,
        },
        use_once: {
            type: Boolean
        },
        start_date: {
            type: Date
        },
        expire_date:{
            type: Date
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