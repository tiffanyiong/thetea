const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product')
// const flash = require('connect-flash')


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
//npm i method-override
 const methodOverride = require('method-override');
//npx nodemon app.js

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// parms the body!? normally it returns empty req.body, 
//so use this to convert it to visible data:  
app.use(express.urlencoded({ extended: true}));
//set the string that we use for methodOverride
app.use(methodOverride('_method'));


// ====================================================================

//usefor dashboard
//if you add more categories, please remember add this in this array
const categories = ['','Bestseller', 'Popular','Other'];

//clienct:

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/shop', async (req, res) => {
    const products = await Product.find({});
    res.render('shop', { products });
})

app.get('/shop/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('product_detail', { product });
})

app.get('/contact', (req, res) => {
    res.render('contact');
})
app.get('/checkout', (req, res) => {
    res.render('checkout');
})
app.get('/cart', (req, res) => {
    res.render('cart');
})


// ====================================================================
//dashboard:

app.get('/dashboard', (req, res) =>{
    res.render('backend/dashboard');
})
app.get('/dashboard/product', async (req, res) =>{
    const products = await Product.find({});
    res.render('backend/product', { products});
})

app.get('/dashboard/product/new', (req, res) => {
    res.render('backend/product_new', { categories }); 
})

app.post('/dashboard/product', async (req, res) => {
    const product = new Product(req.body.product);
    await product.save();
    console.log("data has been saved")
    //TODO 
    //try catch error!!!!!!! 
    
    res.redirect(`/dashboard/product/${product._id}`);
})

app.get('/dashboard/product/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('backend/singleproduct',{ product });
})

app.get('/dashboard/product/:id/edit', async (req, res) =>{
    
    const product = await Product.findById(req.params.id);
    res.render('backend/edit',{ product, categories });
});

app.put('/dashboard/product/:id', async (req, res) =>{
    const { id } = req.params;
    //split the object (we ground things like Product[name])
    const product = await Product.findByIdAndUpdate(id, {...req.body.product }, {new: true})
    console.log("data has saved")
    res.redirect(`/dashboard/product/${product._id}/`);

  
});

app.delete('/dashboard/product/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    console.log("----delete----")
    res.redirect('/dashboard/product');
});
// app.get('/test', async (req, res) => {
//     const tea = new Product({name:'桑葚果菊花茶', price:'88', description:'生津止渴'})
//     await tea.save();
//     res.send(tea);
    
// //    const allproduct = await Product.find({});
// //    res.render('test', { allproduct })
// })

app.listen(3000, () => {
    console.log('Serving on port 3000');
})