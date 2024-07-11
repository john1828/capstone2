const express = require("express");
const { verify } = require("../auth.js");
const router = express.Router();
const cartController = require("../controllers/cart.js");

// Route for getting user's cart
router.get("/get-cart", verify, cartController.getUserCart);

//Route in adding product to cart
router.post("/add-to-cart", verify, cartController.addToCart);

// Route for updating a product quantities in Cart
router.patch(
  "/update-cart-quantity",
  verify,
  cartController.updateCartQuantity
);

// Route in removing items in cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeItem);

// Route in clearing a cart
router.put("/clear-cart", verify, cartController.clearCart);
module.exports = router;
