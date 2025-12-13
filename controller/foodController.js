const foods = require("../model/foodmodel");
const hotels = require("../model/hotelModel");

//Add Book Controller
exports.addFoodController = async (req, res) => {
  console.log("Inside add Book Controller");

  const { foodname, price, category, description, boughtby } = req.body;

  var uploadImages = [];
  req.files.map((item) => uploadImages.push(item.filename));
  const userMail = req.payload;

  console.log(foodname, price, category, description, boughtby);

  try {
    const existingFood = await foods.findOne({ foodname, userMail });
    if (existingFood) {
      res.status(401).json("Already Added this Food");
    } else {
      const newFoods = new foods({
        foodname,
        price,
        category,
        description,
        boughtby,
        uploadImages,
        userMail,
      });
      await newFoods.save();
      res.status(200).json(newFoods);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
