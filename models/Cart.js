const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: [true, "Product ID is required"],
      },
      name: {
        type: String,
        required: [true, "Product name is required"],
      },
      price: {
        type: String,
        required: [true, "Product price is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
      subtotal: {
        type: Number,
        required: [true, "Subtotal is required"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total Price is required"],
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
 