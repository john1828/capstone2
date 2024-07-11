const express = require("express");
const { verify } = require("../auth.js");
const router = express.Router();
const cartController = require("../controllers/cart.js");

// Route for getting user's cart
router.get("/get-cart", verify, cartController.getUserCart);

//Route in adding product to cart
router.post("/add-to-cart", verify, cartController.addCart);

// Route for updating a product quantities in Cart
router.patch(
  "/update-cart-quantity",
  verify,
  cartController.updateCartQuantity
);

module.exports = router;
