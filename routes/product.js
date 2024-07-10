const express = require("express");
const productController = require("../controllers/product.js");
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router(); 

//[SECTION] Route for creating product
router.post("/", verify, verifyAdmin, productController.addProduct);

//[SECTION] Route for retrieving all products
router.get("/all", verify, verifyAdmin, productController.getAllProduct); 

// [SECTION] Route for retrieving all active products
router.get("/active", productController.getActiveProduct);


module.exports = router; 