const carts = require("../model/cartModel");
const users = require("../model/userModel");

// add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const userMail = req.payload; // from JWT middleware

    //  check if user exists
    const user = await users.findOne({ email: userMail });
    if (!user) {
      return res.status(404).json("User not found");
    }

    //  find user's cart
    let addcart = await carts.findOne({ userMail });

    // if cart does not exist, create new cart
    if (!addcart) {
      addcart = new carts({
        userMail,
        items: [{ foodId, quantity }]
      });
    } else {
      // check if item already exists
      const existingItem = addcart.items.find(
        item => item.foodId.toString() === foodId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        addcart.items.push({ foodId, quantity });
      }
    }

    
    await addcart.save();

    res.status(200).json(addcart);

  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong while adding to cart");
  }
};

///get items in cart
// get items in cart
exports.getFoodInCart = async (req, res) => {
  try {
    console.log("Inside Get food in cart Controller");

    const userMail = req.payload; // from JWT middleware

    const cart = await carts
      .findOne({ userMail })
      .populate("items.foodId");

    // 🟢 If cart empty
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        items: [],
        subtotal: 0,
        totalItems: 0,
      });
    }

    let subtotal = 0;
    let totalItems = 0;

    // 🧮 Calculate totals
    const formattedItems = cart.items.map((item) => {
      const price = item.foodId.price;
      const quantity = item.quantity;
      const itemTotal = price * quantity;

      subtotal += itemTotal;
      totalItems += quantity;

      return {
        _id: item._id,
        foodId: item.foodId,
        quantity,
        itemTotal,
      };
    });

    res.status(200).json({
      items: formattedItems,
      subtotal,
      totalItems,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to fetch cart items");
  }
};

///delete from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;   // ✅ FIX HERE
    const userMail = req.payload;    // from JWT

    const cart = await carts.findOne({ userMail });

    if (!cart) {
      return res.status(404).json("Cart not found");
    }

    // Remove item
    cart.items = cart.items.filter(
      item => item.foodId.toString() !== foodId
    );

    await cart.save();

    return res.status(200).json("Item removed from cart");

  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to remove item from cart");
  }
};

