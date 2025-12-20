const { trusted } = require("mongoose");
const hotels = require("../model/hotelModel");
const jwt = require("jsonwebtoken");

//hotel Register
exports.hotelRegisterController = async (req, res) => {
  console.log("Inside hotel register controller");

  const { hotelname, email, password, confirmpassword ,phone,description} = req.body;
  console.log(hotelname, email, password, confirmpassword,phone,description);

  //logic
  try {
    const existingHotel = await hotels.findOne({ email });
    if (existingHotel) {
      res.status(404).json("Hotel Already Exist please login");
    } else {
      const newHotel = new hotels({
        hotelname,
        email,
        password,
        confirmpassword,
        description,
        phone
      });
      await newHotel.save();
      res.status(200).json("Hotel Registered Successfully");
    }
  } catch (error) {
    res.status(500).json("Something Went wrong");
  }
};

///hotel login
exports.hotelLoginController = async (req, res) => {
  console.log("Inside hotel Login Controller");
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const existingHotel = await hotels.findOne({ email });
    if (existingHotel) {
      if (existingHotel.password == password) {
        const token = jwt.sign(
          { userMail: existingHotel.email, role: existingHotel.role },
          process.env.JWtSecretKey
        );
        res.status(200).json({existingHotel,token,});
      } else {
        res.status(401).json("Invalid Crendentials");
      }
    } else {
      res.status(404).json("Hotel not found plese register");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

///update hotel profile controller
exports.updateHotelProfileController = async (req, res) => {
  console.log("Inside update hotel profile contrller");

  const { hotelname, password, description, phone } = req.body;
  const email = req.payload;
  console.log(hotelname, password, description, phone);

  // FIX 1: use existing values instead of undefined variables
const uploadProfile = req.files?.profile
    ? req.files.profile[0].filename
    : req.body.profile;
    const uploadPhotos = req.files?.uploadImages
  ? req.files.uploadImages.map((file) => file.filename)
  : req.body.uploadImages;


  try {
    const updateHotel = await hotels.findOneAndUpdate(
      { email },
      {
        hotelname,
        password,
        description,
        phone,
        profile: uploadProfile,
        uploadImages: uploadPhotos,
      },
      { new: true }
    );

    res.status(200).json(updateHotel);
  } catch (error) {
    res.status(500).json(error);
  }
};

//get hotel data
exports.getHotelInfoController=async(req,res)=>{
  console.log("Inside Get Hotel Info Controller");

  try {
    const userMail=req.payload

    const hotelInfo=await hotels.findOne({email:userMail})
    res.status(200).json(hotelInfo)

  } catch (error) {
    res.status(500).json(error)
    
  }
  
}