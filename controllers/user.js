const User = require("../models/User.js");
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const { errorHandler } = auth;
 
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


module.exports.addCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { userId } = req.user;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const subtotal = product.price * quantity;
    const cart = new Cart({
      userId: req.user.id,
      cartItems: [{ productId: req.body.productId, quantity: req.body.quantity, subtotal: subtotal}],
      totalPrice: subtotal
    });

    await cart.save();
    res.status(201).send({message: "Items added to cart successfully", cart});
  } catch (err) {
    res.status(500).send(err.message);
  }
};