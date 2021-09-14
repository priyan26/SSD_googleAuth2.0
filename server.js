const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Load the Globals
dotenv.config({path: './Globals/.env'})


const app = express()

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
