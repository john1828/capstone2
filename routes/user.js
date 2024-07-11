const express = require("express");
const userController = require("../controllers/user.js");
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
// router.post("/details", verify, userController.retrieveUserDetails);

//Route for retrieving user details
router.get("/details", verify, userController.getProfile);

//[SECTION] Route for updating user as admin
router.patch(
  "/:userId/set-as-admin",
  verify,
  verifyAdmin,
  userController.updateAsAdmin
);

//Route for updating password
router.patch("/update-password", verify, userController.updatePassword);

// Route for getting user's cart
router.get("/get-cart", verify, userController.getUserCart);

//Route in adding product to cart
router.post("/add-to-cart", verify, userController.addCart);

// Route for updating a product quantities in Cart
router.patch(
  "/update-cart-quantity",
  verify,
  userController.updateCartQuantity
);

//Export Route System
module.exports = router;
