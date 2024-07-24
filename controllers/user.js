const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const { errorHandler } = auth;

// Controllers

// function for registering a user
module.exports.registerUser = async (req, res) => {
  const { email, mobileNo, password, firstName, lastName } = req.body;

  if (!email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" });
  }

  if (mobileNo.length !== 11) {
    return res.status(400).send({ error: "Mobile number invalid" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .send({ error: "Password must be at least 8 characters" });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).send({ error: "User already exists" });
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        mobileNo,
        password: bcrypt.hashSync(password, 10),
      });

      return newUser.save().then((savedUser) => {
        res.status(201).send({
          message: "Registered Successfully",
          user: savedUser,
        });
      });
    })
    .catch((error) => errorHandler(error, req, res));
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
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      } else {
        return res.status(200).send(user);
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//function to update another user as an admin
module.exports.updateAsAdmin = (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send({
      message: "User ID is required",
    });
  }

  return User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send({
          message: "User not found",
        });
      }
      return res.status(200).send(updatedUser);
    })
    .catch((error) => {
      res.status(500).send({
        error: "Failed to update user",
        details: error.message,
      });
    });
};

//Function to update password
module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // update userId to id because our version of req.user does not have userId property but id property instead.
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update userId update to id
    // Updating the user's password in the database
    await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    // Sending a success response
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
