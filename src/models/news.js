const mongoose = require('mongoose')

const newSchema = new mongoose.Schema({
    title: {
        type:String,
        trim:true,
        required: true

    },
description: {
    type:String,
    trim:true,
    required:true
},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Reporter'

},

newsImage:{
    type:Buffer
}

},
{
    timestamps:true
}
)
const News = mongoose.model('News',newSchema)
module.exports = News