// Importing modules and dependencies
const express = require("express");
const orderController = require("../controllers/order.js");
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// Route in creating an order
router.post("/checkout", verify, orderController.checkOut);

// Route in retrieving logged in user's order
router.get("/my-orders", verify, orderController.getUserOrder);
// Exporting the router module
module.exports = router;
