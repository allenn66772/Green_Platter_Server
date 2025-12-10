const users =require("../model/userModel")
const jwt=require("jsonwebtoken")

//register
exports.registerController=async(req,res)=>{
    console.log("Inside register user controller");

    const {username,password,confirmpassword,email}=req.body
    console.log(username,password,confirmpassword,email);

    //logic
    try{
        const existingUser=await users.findOne({email})
        if(existingUser){
            res.status(404).json("User already exists.... Please login")
        }else{
            const newUser=new users({
                username,email,password,confirmpassword
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }catch(error){
        res.status(500).json(error)
    }
    
    
}

