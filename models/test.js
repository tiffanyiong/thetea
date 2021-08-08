const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/the-tea-shop', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    //findByIdAndUpdate will be affected: so useFindAndModify true -> false
    useFindAndModify: false
})
.then(() => {
    console.log("-------DATABASE CONNECTION OPEN---------");
})
.catch(err => {
    console.log(" database connection error: ")
    console.log(err);
})





//////////////


const ProductSchema = new Schema({
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



});

module.exports = mongoose.model('Product', ProductSchema);
//////////////
const cartSchema = new Schema({
    qty: Number,
    products : [ { type: Schema.Types.ObjectId, ref:'Product'}],
    subtotal: Number
});



const cart = mongoose.model('Cart', cartSchema);
const product = mongoose.model('Product', ProductSchema);

const makeCart = async (req, res) => {
    const cart = new Cart({qty: 9, subtotal:666});
    const item = await Product.findOne({ _id:'6109a06801c91d75ee87b732'});
    cart.product.push(item);
    console.log(cart);
}
makeCart();