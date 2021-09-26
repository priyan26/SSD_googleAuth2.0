const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars')
const MongoStore = require('connect-mongo')
global.rt = undefined;
const methodOverride = require('method-override')

// Load the Globals
dotenv.config({path: './Globals/.env'})

//Require the passport auth configuration
require('./auth/passport')(passport)

const app = express()

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Set Express Session Middleware
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET || 'SSD Assignment 2',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB_URL || 'mongodb+srv://ssd:ssd123@ssd.vuj0f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    })
}))

//Handlebars Helpers
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

// Handlebars
app.engine('.hbs',
    exphbs({
        helpers:{
            formatDate,
            stripTags,
            truncate,
            editIcon,
            select,
        },
        defaultLayout: 'main',
        extname: '.hbs'
    })
);
app.set('view engine', '.hbs');

//Set Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//set Global Varieble
app.use(function(req,res,next){
    res.locals.user=req.user ||null
    next()
})
//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
app.use('/file',require('./routes/fileUpload'))
app.use('/video',require('./routes/videoUpload'))

const PORT = process.env.PORT || 8000


mongoose.connect(process.env.MONGO_DB_URL || 'mongodb+srv://ssd:ssd123@ssd.vuj0f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) =>
        console.log('DB connection error ', err));


app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))
