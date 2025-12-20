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
  console.log("Inside update hotel profile controller");

  try {
    const { hotelname, password, description, phone } = req.body;
    const email = req.payload; // from JWT middleware

    /* ---------------- FILE HANDLING (SINGLE IMAGE) ---------------- */

    // profile image (single)
    const uploadProfile = req.files?.profile
      ? req.files.profile[0].filename
      : undefined;

    // hotel image (single)
    const uploadHotelImage = req.files?.uploadImages
      ? req.files.uploadImages[0].filename
      : undefined;

    /* ---------------- UPDATE OBJECT ---------------- */

    const updateData = {
      hotelname,
      description,
      phone,
    };

    // update password only if provided
    if (password) {
      updateData.password = password;
    }

    // update profile image only if uploaded
    if (uploadProfile) {
      updateData.profile = uploadProfile;
    }

    // update hotel image only if uploaded
    if (uploadHotelImage) {
      updateData.uploadImages = uploadHotelImage;
    }

    /* ---------------- DB UPDATE ---------------- */

    const updatedHotel = await hotels.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json("Hotel not found");
    }

    res.status(200).json(updatedHotel);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
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