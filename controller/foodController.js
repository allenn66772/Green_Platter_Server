const foods = require("../model/foodmodel");
const hotels = require("../model/hotelModel");

//Add food Controller
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

// get hotel added foods
exports.getHotelAddedFoodController=async(req,res)=>{
  console.log("Inside Get Hotel Added Food Controller ");
  
  const userMail=req.payload
  const query={
    userMail:{$eq:userMail},
  }
  try {
    const hotelFoods=await foods.find(query)
    res.status(200).json(hotelFoods)
    
  } catch (error) {
    res.status(500).json(error)
    
  }
} 
//get all foods
exports.getHomeFoodsController=async(req,res)=>{
  console.log("Inside get home foods controller");
try{
  const homeFoods=await foods.find().sort({_id:-1}).limit(4)
  res.status(200).json(homeFoods)
}catch(error){
  res.status(500).json(error)

}
   
  
}
