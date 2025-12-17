const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userMail: {
      type: String,
      required: true,
    },

    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "foods",
          required: true,
        },
        foodname: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],

    orderTotal: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "Delivered", "Cancelled"],
      default: "Pending",
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const orders = mongoose.model("orders", orderSchema);
module.exports = orders;
