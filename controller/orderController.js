const orders =require("../model/ordermodel")
const foods = require("../model/foodmodel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrderController = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("JWT PAYLOAD:", req.payload);

    const { items, paymentMethod, deliveryAddress } = req.body;
    const userMail = req.payload;

    // 🔐 Auth check
    if (!userMail) {
      return res.status(401).json("Unauthorized");
    }

    // 🛑 Cart validation
    if (!items || items.length === 0) {
      return res.status(400).json("Cart is empty");
    }

    let orderTotal = 0;
    const orderItems = [];
    const line_items = [];
    let hotelMail = ""; // ✅ REQUIRED FIELD

    // 🔁 Process cart items
    for (const item of items) {
      const food = await foods.findById(item.foodId);

      if (!food) {
        return res.status(404).json("Food not found");
      }

      // ✅ Assign hotel mail from food owner (once)
      if (!hotelMail) {
        hotelMail = food.userMail;
      }

      orderItems.push({
        foodId: food._id,
        quantity: item.quantity,
        price: food.price,
      });

      orderTotal += food.price * item.quantity;

      // 💳 Stripe line items
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

    // 🔴 CARD PAYMENT → STRIPE
    if (paymentMethod === "CARD") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items,
        success_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-error",
      });

      const newOrder = new orders({
        userMail,
        hotelMail, // ✅ FIXED
        items: orderItems,
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
      hotelMail, // ✅ FIXED
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
    console.error("🔥 ORDER ERROR:", err);
    return res.status(500).json(err.message);
  }
};


//view orders
exports.getHotelOrdersController = async (req, res) => {
  try {
    const hotelMail = req.payload; // from hotel JWT

    const hotelOrders = await orders.find({ hotelMail })
      .populate("items.foodId")
      .sort({ createdAt: -1 });

    res.status(200).json(hotelOrders);
  } catch (error) {
    console.error("Get hotel orders error:", error);
    res.status(500).json("Failed to fetch hotel orders");
  }
};


// update order status (Pending → Approved)
exports.updateOrderStatusController = async (req, res) => {
  try {
    console.log("Inside Update Order Status Controller");

    const { orderId } = req.params;
    const hotelMail = req.payload;

    const order = await orders
      .findById(orderId)
      .populate("items.foodId");

    if (!order) {
      return res.status(404).json("Order not found");
    }

    // Prevent double approval
    if (order.status !== "Pending") {
      return res
        .status(400)
        .json(`Order already ${order.status}`);
    }

    // Authorization check (ignore deleted foods safely)
    const isAuthorizedHotel = order.items.some(
      (item) => item.foodId && item.foodId.userMail === hotelMail
    );

    if (!isAuthorizedHotel) {
      return res
        .status(403)
        .json("Not authorized to update this order");
    }

    // Approve order
    order.status = "Approved";
    await order.save();

    return res.status(200).json({
      message: "Order approved successfully",
      order,
    });

  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json(error.message);
  }
};

