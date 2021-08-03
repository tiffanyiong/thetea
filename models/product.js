const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    catagory: String,
    onsale: {
        type: Boolean,
        default: false
    },
    qty: Number,
    weight: Number,
    

});

module.exports = mongoose.model('Product', ProductSchema);