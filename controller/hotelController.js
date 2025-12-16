const { trusted } = require("mongoose");
const hotels = require("../model/hotelModel");
const jwt = require("jsonwebtoken");

//hotel Register
exports.hotelRegisterController = async (req, res) => {
  console.log("Inside hotel register controller");

  const { hotelname, email, password, confirmpassword } = req.body;
  console.log(hotelname, email, password, confirmpassword);

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
///get hotels in hotel profile
exports.getHotelinProfileController=async(req,res)=>{
  console.log("Inside Hotels in Profile Controller");

  const userMail=req.payload

  try {
    const hotelProfile=await hotels.find({email:{$eq:userMail}})
    res.status(200).json(hotelProfile)
    
  } catch (error) {
    res.status(500).json(error)
    
  }
  

}