const hotels = require("../model/hotelModel");
const jwt = require("jsonwebtoken");

//hotel login
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
