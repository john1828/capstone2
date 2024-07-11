const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const auth = require("../auth.js");
const { errorHandler } = auth;

// Controller function to get users Cart
module.exports.getUserCart = (req, res) => {
  Cart.findOne({ userId: req.user.id })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({
          message: "Cart not Found",
        });
      } else {
        return res.status(200).send({
          cart,
        });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Controller function for adding products to cart
module.exports.addToCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Find the user's cart
    let userCart = await Cart.findOne({ userId: req.user.id });

    if (!userCart) {
      // If no cart exists, create a new one
      const subtotal = product.price * quantity;

      const cart = new Cart({
        userId: req.user.id,
        cartItems: [
          {
            productId: productId,
            quantity: quantity,
            subtotal: subtotal,
          },
        ],
        totalPrice: subtotal,
      });
      await cart.save();

      return res.status(200).send({
        message: "Items added to cart successfully",
        cart,
      });
    } else {
      // If cart exists, update it
      let cartItem = userCart.cartItems.find(
        (item) => item.productId.toString() === productId
      );

      if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.subtotal = product.price * cartItem.quantity;
      } else {
        userCart.cartItems.push({
          productId: productId,
          quantity: quantity,
          subtotal: product.price * quantity,
        });
      }

      // Update total price of the cart
      userCart.totalPrice = userCart.cartItems.reduce(
        (total, item) => total + item.subtotal,
        0
      );

      // Save the updated cart
      await userCart.save();

      return res.status(200).send({
        message: "Cart updated successfully",
        cart: userCart,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "An error occurred while adding items to the cart",
      error,
    });
  }
};

// Controller function for updating product quantities in Cart
module.exports.updateCartQuantity = async (req, res) => {
  try {
    const productId = req.body.productId; // Assuming productId is sent in the request body
    const quantity = req.body.quantity;

    if (!quantity || quantity <= 0) {
      return res.status(400).send({ message: "Invalid quantity" });
    }

    const userCart = await Cart.findOne({ userId: req.user.id });

    if (!userCart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    const cartItem = userCart.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).send({ message: "Item not found in cart" });
    }

    cartItem.quantity = quantity;
    cartItem.subtotal =
      cartItem.quantity * (await Product.findById(productId)).price;

    // Update total price of the cart
    userCart.totalPrice = userCart.cartItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    const updatedCart = await userCart.save();

    return res.status(200).send({
      message: "Item quantity updated successfully",
      updatedCart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "An error occurred while updating the cart",
      error,
    });
  }
};

// Controller function for removing an item from the cart
module.exports.removeItem = async (req, res) => {
  try {
    const productId = req.params.productId; // productId will be in params

    const userCart = await Cart.findOne({ userId: req.user.id });

    if (!userCart) {
      return res.status(404).send({
        message: "Cart not found",
      });
    }

    const cartItemIndex = userCart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex !== -1) {
      userCart.cartItems.splice(cartItemIndex, 1);

      // Update total price of the cart
      userCart.totalPrice = userCart.cartItems.reduce(
        (total, item) => total + item.subtotal,
        0
      );

      const updatedCart = await userCart.save();

      return res.status(200).send({
        message: "Item removed from cart successfully",
        updatedCart: updatedCart,
      });
    } else {
      return res.status(404).send({
        message: "Item not found in cart",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "An error occurred while removing the item from the cart",
      error,
    });
  }
};

// Controller function for clearing a cart
module.exports.clearCart = (req, res) => {
  Cart.findOne({ userId: req.user.id })
    .then((userCart) => {
      if (!userCart) {
        return res.status(404).send({
          message: "Cart not found",
        });
      }

      if (userCart.cartItems.length > 0) {
        userCart.cartItems = [];
        userCart.totalPrice = 0;

        return userCart.save().then((updatedCart) => {
          res.status(200).send({
            message: "Cart cleared successfully",
            cart: updatedCart,
          });
        });
      } else {
        return res.status(200).send({
          message: "Cart is already empty",
        });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
