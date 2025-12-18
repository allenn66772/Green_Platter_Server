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
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "UPI", "CARD"],
    },

    deliveryAddress: {
      fullname: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },

    orderTotal: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
module.exports =
  mongoose.models.orders || mongoose.model("orders", orderSchema);
