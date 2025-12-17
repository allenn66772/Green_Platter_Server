const orders=require("../model/ordermodel")

exports.createOrderController = async (req, res) => {
  try {
    const { items, paymentMethod, deliveryAddress } = req.body;

  
    const userMail = req.payload;

    if (!items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json("Missing required fields");
    }

    let orderTotal = 0;

    const updatedItems = items.map((item) => {
      const totalPrice = item.price * item.quantity;
      orderTotal += totalPrice;

      return { ...item, totalPrice };
    });

    const newOrder = new orders({
      userMail,
      items: updatedItems,
      orderTotal,
      paymentMethod,
      deliveryAddress,
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (err) {
    res.status(500).json(err.message);
  }
};

