const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product')


mongoose.connect('mongodb://localhost:27017/the-tea-shop', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => {
    console.log("-------DATABASE CONNECTION OPEN---------");
})
.catch(err => {
    console.log(" database connection error: ")
    console.log(err);
})
//npm i method-override
// const methodOverride = require('method-override');
//npx nodemon app.js

const app = express();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// parms the body!? normally it returns empty req.body, 
//so use this to convert it to visible data:  
app.use(express.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, 'public')));


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

app.get('/contact', (req, res) => {
    res.render('contact');
})
app.get('/checkout', (req, res) => {
    res.render('checkout');
})
app.get('/cart', (req, res) => {
    res.render('cart');
})


app.get('/test', async (req, res) => {
    const tea = new Product({name:'桑葚果菊花茶', price:'88', description:'生津止渴'})
    await tea.save();
    res.send(tea);
    
//    const allproduct = await Product.find({});
//    res.render('test', { allproduct })
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})