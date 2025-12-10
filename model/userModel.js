const mongoose =require("mongoose")

const userSchema =new mongoose.Schema({
    username:{
        type :String,
        required: true
    },
    email:{
        type :String,
        required: true
    },
    password:{
        type :String,
        required: true
    },
    confirmpassword:{
        type :String,
        
    },
    profile:{
        type :String,
        default:""
    },
    bio:{
        type:String,
        default:" User"
    },
    role:{
        type:String,
        default:"user"
    }
})

const users = mongoose.model("users",userSchema)
module.exports =users