const express=require("express")
const { registerController } = require("./controller/userController")


const router =express.Router()

                          //User
////Register
router.post("/user-register",registerController)







module.exports=router