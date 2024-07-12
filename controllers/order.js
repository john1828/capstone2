const Order = require("../models/Order.js");
const Cart = require("../models/Cart.js");
const auth = require("../auth.js");
const { errorHandler } = auth;

// Controller function for user to create an order
module.exports.checkOut = async (req, res) => {
  try {
    const userCart = await Cart.findOne({ userId: req.user.id });

    if (!userCart) {
      // If no user's cart exists
      return res.status(404).send({
        message: "User cart not found",
      });
    } else if (userCart.cartItems.length > 0) {
      const productsOrdered = userCart.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }));

      const userOrder = new Order({
        userId: req.user.id,
        productsOrdered: productsOrdered,
        totalPrice: userCart.totalPrice,
      });

      await userOrder.save();
      return res.status(200).send({
        message: "Ordered successfully",
      });
    } else {
      return res.status(404).send({
        error: "No items to checkout",
      });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Controller function for user logged in to retrieve orders
module.exports.getUserOrder = async (req, res) => {
  try {
    Order.findOne({ userId: req.user.id }).then((userOrder) => {
      if (!userOrder) {
        return res.status(404).send({
          error: "User orders not found",
        });
      } else {
        return res.status(200).send({
          orders: [userOrder],
        });
      }
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

//Retrieve all user's orders
module.exports.getAllOrders = (req, res) => {
  return Order.find({})
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send({ orders: result });
      } else {
        return res.status(404).send({ message: "No order found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
