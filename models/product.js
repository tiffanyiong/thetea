const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    saleprice: Number,
    category: String,
    flavor: String,
    onsale: {
        type: Boolean,
        default: false
    },
    qty: {
        type: Number,
        default: 0
    },
    description: String,
    image:[
        {
        url: String,
        filename: String
      }
    ]
});

module.exports = mongoose.model('Product', productSchema);