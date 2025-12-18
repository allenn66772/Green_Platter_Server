const orders = require("../model/orderModel");
const foods = require("../model/foodmodel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrderController = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { items, paymentMethod, deliveryAddress } = req.body;
    const userMail = req.payload;

    if (!items || items.length === 0) {
      return res.status(400).json("Cart is empty");
    }

    let orderTotal = 0;
    const orderItems = [];
    const line_items = [];

    for (const item of items) {
      const food = await foods.findById(item.foodId); // ✅ CORRECT

      if (!food) {
        return res.status(404).json("Food not found");
      }

      // ✅ build order items (schema requires price)
      orderItems.push({
        foodId: food._id,
        quantity: item.quantity,
        price: food.price,
      });

      orderTotal += food.price * item.quantity;

      if (paymentMethod === "CARD") {
        line_items.push({
          price_data: {
            currency: "inr",
            product_data: {
              name: food.foodname,
            },
            unit_amount: food.price * 100,
          },
          quantity: item.quantity,
        });
      }
    }

    // 🔴 CARD PAYMENT
    if (paymentMethod === "CARD") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items,
        success_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-error",
      });

      const newOrder = new orders({
        userMail,
        items: orderItems, // ✅ NEVER req.body.items
        paymentMethod,
        deliveryAddress,
        orderTotal,
        status: "Pending",
      });

      await newOrder.save();

      return res.status(200).json({
        checkoutSessionUrl: session.url,
        orderId: newOrder._id,
      });
    }

    // 🟢 COD / UPI
    const newOrder = new orders({
      userMail,
      items: orderItems,
      paymentMethod,
      deliveryAddress,
      orderTotal,
      status: "Pending",
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (err) {
    console.error("🔥 ORDER ERROR FULL:", err);
    return res.status(500).json(err.message);
  }
};

//view orders
exports.getAllOrdersController = async (req, res) => {
  try {
    const allOrders = await orders
      .find()
      .populate("items.foodId")
      .sort({ createdAt: -1 });

    res.status(200).json(allOrders);
  } catch (error) {
    console.error("View all orders error:", error);
    res.status(500).json(error.message);
  }
};
