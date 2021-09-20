const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan= require('morgan')
const exphbs= require('express-handlebars')

// Load the Globals
dotenv.config({path: './Globals/.env'})


const app = express()

// Logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

// Handlebars
app.engine('.hbs',exphbs({defaultLaout:'main',extname:'.hbs'}));
app.set('view engine','.hbs');

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
const PORT = process.env.PORT || 8000


mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) =>
        console.log('DB connection error ', err));


app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))
