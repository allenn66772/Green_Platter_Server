const express=require("express")
const { registerController, loginController } = require("./controller/userController")
const { hotelRegisterController, hotelLoginController } = require("./controller/hotelController")


const router =express.Router()

                          //User
////Register
router.post("/user-register",registerController)
////Login
router.post("/user-login",loginController)



                        //Hotels
////Hotel Register
router.post("/hotel-register",hotelRegisterController)     
////Hotel Login
router.post("/hotel-login",hotelLoginController)                   



module.exports=router