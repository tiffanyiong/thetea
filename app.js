if (process.env.NODE_ENV !== "product") {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Joi = require('joi'); //need to also define our schema
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./helpers/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Cart = require('./models/cart');
const userRoute = require('./routes/user');
const frontendRoute = require('./routes/frontend');
const backendRoute = require('./routes/backend');

const { send } = require('process');

// const flash = require('connect-flash')


const dbUrl = process.env.DB_URL;
// 'mongodb://localhost:27017/the-tea-shop' or udUrl <--this is mongo db online
mongoose.connect(dbUrl, { 
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

const sessionConfig = {
    secret: 'this is secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 * 60 *24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());


// passport should be under session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    if(req.session.hasOwnProperty('cart')){
        res.locals.navCart = await Cart.findById(req.session.cart._id);
            await res.locals.navCart.populate('cart.items.productId').execPopulate(); 
            //execpopulate只能這樣用，不能Cart.findById後連著.populate用
    } 
   
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoute);
app.use('/', frontendRoute);
app.use('/dashboard',backendRoute);


app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
});

//handle async error
app.use((err, req, res, next) => {
    const{ statusCode = 500 } = err;
    if (!err.message) err.message ='Oops, something went wrong!'
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});