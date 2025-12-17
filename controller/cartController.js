const carts = require("../model/cartModel");
const users = require("../model/userModel");

// add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const userMail = req.payload; // from JWT middleware

    // 🔍 check if user exists
    const user = await users.findOne({ email: userMail });
    if (!user) {
      return res.status(404).json("User not found");
    }

    // 🛒 find user's cart
    let cart = await carts.findOne({ userMail });

    // if cart does not exist, create new cart
    if (!cart) {
      cart = new carts({
        userMail,
        items: [{ foodId, quantity }]
      });
    } else {
      // check if item already exists
      const existingItem = cart.items.find(
        item => item.foodId.toString() === foodId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ foodId, quantity });
      }
    }

    // 💾 save cart
    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong while adding to cart");
  }
};
