const express=require("express")
const { registerController, loginController } = require("./controller/userController")
const { hotelRegisterController, hotelLoginController, getHotelinProfileController } = require("./controller/hotelController")
const jwtMiddleware = require("./middleware/jwtMiddleware")
const multerConfig = require("./middleware/imgMulterMiddleware")
const { addFoodController, getHotelAddedFoodController, getHomeFoodsController, getAllFoodsController, getAFoodController } = require("./controller/foodController")


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
/////Add-foods
router.post("/add-food",jwtMiddleware,multerConfig.array("uploadImages",3),addFoodController)   
////Get-Hotel-added-foods
router.get("/hotel-added-foods",jwtMiddleware,getHotelAddedFoodController)  
////Get home Foods
router.get("/home-foods",getHomeFoodsController)   
////Get All Foods
router.get("/all-foods",getAllFoodsController)
////Get a Food Controller
router.get("/view-food/:id",jwtMiddleware,getAFoodController)
///Get hotel details in admin
router.get("/hotelProfile",jwtMiddleware,getHotelinProfileController)








module.exports=router