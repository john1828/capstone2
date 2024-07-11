const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const auth = require("../auth.js");
const { errorHandler } = auth;

// Controller function to get users Cart
module.exports.getUserCart = async (req, res) => {
  if (req.user.isAdmin) {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden",
    });
  }

  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }
    res.status(200).send({ cart: cart });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Controller function for adding products to cart
module.exports.addCart = async (req, res) => {
  if (req.user.isAdmin) {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden",
    });
  }

  const { productId, quantity } = req.body;
  const { userId } = req.user;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    const subtotal = product.price * quantity;
    const cart = new Cart({
      userId: req.user.id,
      cartItems: [
        {
          productId: req.body.productId,
          quantity: req.body.quantity,
          subtotal: subtotal,
        },
      ],
      totalPrice: subtotal,
    });

    await cart.save();
    res.status(201).send({ message: "Items added to cart successfully", cart });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Controller function for Updating product quantities in Cart
module.exports.updateCartQuantity = (req, res) => {
  const productId = req.body.productId; // Assuming productId is sent in the request body

  Cart.findOne({ userId: req.user.id })
    .then((userCart) => {
      if (!userCart) {
        return res.status(404).send({
          message: "Cart not found",
        });
      } else {
        let cartItem = userCart.cartItems.find(
          (item) => item.productId === productId
        );
        if (cartItem) {
          cartItem.quantity += req.body.quantity;
          cartItem.subtotal *= cartItem.quantity;

          // Update total price of the cart
          userCart.totalPrice = cartItem.subtotal;

          // Save the updated cart
          return userCart.save();
        } else {
          return res.status(404).send({ message: "Product not found in cart" });
        }
      }
    })
    .then((updatedCart) => {
      res.status(200).send({
        message: "Item quantity updated successfully",
        updatedCart: updatedCart,
      });
    })
    .catch((error) => errorHandler(error, req, res));
};
