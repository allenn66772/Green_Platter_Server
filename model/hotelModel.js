const mongoose =require("mongoose")

const hotelSchema =new mongoose.Schema({
    hotelname:{
        type :String,
        required: true
    },
    phone:{
        type:Number,
        default:""
    },
    description:{
        type:String,
        default:""
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
        default:"hotel"
    },
    uploadImages:{
        type:Array
    }

})

const hotels = mongoose.model("hotels",hotelSchema)
module.exports =hotels