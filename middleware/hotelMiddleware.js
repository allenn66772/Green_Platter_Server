const jwt=require("jsonwebtoken")

const hotelMiddleware=(req,res,next)=>{
    console.log("Inside hotel Middleware");
    const token=req.headers.authorization.split(" ")[1]
    console.log(token);

    try {
        const jwtResponse=jwt.verify(token,process.env.JWtSecretKey)
         console.log(jwtResponse);
         req.payload=jwtResponse.userMail
         if(jwtResponse.role=="hotel"){
            next()
         }else{
            res.status(401).json("Unauthorized user")
         }
         
        
    } catch (err) {
        res.status(500).json("Invalid token",err)
        
    }
    
    
}
module.exports=hotelMiddleware