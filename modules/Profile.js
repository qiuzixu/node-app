const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema'
const ProfileSchema = new Schema({
    type:{
        type:String
    },
    describle:{
        type:String
    },
    income:{
        type:String,
        required:true
    },
    expend:{
        type:String,
        required:true
    },
    cash:{
        type:String,
        required:true
    },
    remark:{
        type:String
    },
    // identify:{
    //     type:String,
    //     required:true

    // },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = Profile = mongoose.model('profile',ProfileSchema)