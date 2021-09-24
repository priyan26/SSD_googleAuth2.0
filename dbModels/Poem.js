const mongoose = require('mongoose')

const PoemSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    stat:{
        type:String,
        default:'public',
        enum:['public','private']
    },
   user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'GoogleUserSchema',
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Poem',PoemSchema)