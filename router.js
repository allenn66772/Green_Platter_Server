const express = require("express");
const {
  registerController,
  loginController,
} = require("./controller/userController");
const {
  hotelRegisterController,
  hotelLoginController,
  getHotelinProfileController,
  updateHotelProfileController,
  getHotelInfoController,
} = require("./controller/hotelController");
const jwtMiddleware = require("./middleware/jwtMiddleware");
const multerConfig = require("./middleware/imgMulterMiddleware");
const {
  addFoodController,
  getHotelAddedFoodController,
  getHomeFoodsController,
  getAllFoodsController,
  getAFoodController,
} = require("./controller/foodController");
const { createOrderController, getAllOrdersController, getHotelOrdersController } = require("./controller/orderController");
const { addToCart, getFoodInCart, removeFromCart } = require("./controller/cartController");
const hotelMiddleware = require("./middleware/hotelMiddleware");

const router = express.Router();

//User
////Register
router.post("/user-register", registerController);
////Login
router.post("/user-login", loginController);

//Hotels
////Hotel Register
router.post("/hotel-register", hotelRegisterController);
////Hotel Login
router.post("/hotel-login", hotelLoginController);
/////Add-foods
router.post("/add-food",hotelMiddleware,multerConfig.array("uploadImages", 3),addFoodController);
//get hotel info
router.get("/get-hotel-profile",jwtMiddleware,getHotelInfoController)
////Get-Hotel-added-foods
router.get("/hotel-added-foods", jwtMiddleware, getHotelAddedFoodController);
////Get home Foods
router.get("/home-foods", getHomeFoodsController);
////Get All Foods
router.get("/all-foods", getAllFoodsController);
////Get a Food Controller
router.get("/view-food/:id", jwtMiddleware, getAFoodController);
///Get hotel details in admin

////
router.put("/update-hotel",hotelMiddleware,multerConfig.fields([{ name: "profile", maxCount: 1 },{ name: "uploadImages", maxCount: 5 }]),updateHotelProfileController);
///Order
router.post("/create-order", jwtMiddleware, createOrderController);
//
router.post("/add-to-cart", jwtMiddleware, addToCart);
//
router.get("/get-cart", jwtMiddleware, getFoodInCart);
//delete from cart
router.delete("/remove-from-cart/:foodId",jwtMiddleware,removeFromCart)
//stripe
// router.post("/create-pay", jwtMiddleware, createOrderController);
router.get("/all-orders",hotelMiddleware, getHotelOrdersController);



module.exports = router;
