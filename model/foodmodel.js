const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  boughtby: {
    type: String,
    default: "",
  },
  uploadImages: {
    type: Array,
    required: true,
  },
  userMail: {
    type: String,
    required: true,
  },
});

const foods = mongoose.model("foods", foodSchema);
module.exports = foods;
