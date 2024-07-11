const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const { errorHandler } = auth;
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

// Controller function for registering a user
module.exports.registerUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" });
  } else if (req.body.mobileNo.length !== 11) {
    return res.status(400).send({ error: "Mobile number invalid" });
  } else if (req.body.password.length < 8) {
    return res
      .status(400)
      .send({ error: "Password must be atleast 8 characters" });
  } else {
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    return newUser
      .save()
      .then((savedUser) => {
        res.status(201).send({
          message: "Registered Successfully",
        });
      })
      .catch((error) => errorHandler(error, req, res));
  }
};

// Controller function to log in a user
module.exports.loginUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ error: "Invalid Email" });
  }
  return User.findOne({ email: req.body.email })
    .then((result) => {
      if (result == null) {
        return res.status(404).send({ error: "No Email found" });
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        );

        if (isPasswordCorrect) {
          return res.status(200).send({
            access: auth.createAccessToken(result),
          });
        } else {
          return res
            .status(401)
            .send({ message: "Email and password do not match" });
        }
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//Controller function to retrieving user details
module.exports.getProfile = (req, res) => {
  return User.findById(req.body.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      } else {
        return res.status(200).send({ user: user });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//Controller function to update another user as an admin
module.exports.updateAsAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isAdmin = true;
    await user.save();
    res.status(200).json({ updatedUser: user });
  } catch (error) {
    res.status(500).json({ error: "Failed in Find", details: error.message });
  }
};

//Function to update password
module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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
          userCart.totalPrice = userCart.cartItems.reduce(
            (total, item) => total + item.subtotal,
            0
          );

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
