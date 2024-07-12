const express = require("express");
const { verify, verifyAdmin } = require("../auth.js");
const router = express.Router();
const orderController = require("../controllers/order.js");

//Route for retrieving all user's orders
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;