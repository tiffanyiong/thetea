const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema = new Schema ({
    qty: Number,
    subtotal: Number,
    products : [ {
         type: mongoose.Schema.Types.ObjectId, 
         ref:'Product'
        }],
})
module.exports = mongoose.model('Cart', cartSchema);