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

// Route for Retrieving single product
router.get("/:productId", productController.retrieveSingleProduct);

// Route for Updating Product information
router.patch(
  "/:productId/update",
  verifyAdmin,
  productController.updateProduct
);

// Route for Archiving a product
router.patch(
  "/:productId/archive",
  verifyAdmin,
  productController.archiveProduct
);

// Route for Activating a product
router.patch(
  "/:productId/activate",
  verifyAdmin,
  productController.activateProduct
);

module.exports = router;
