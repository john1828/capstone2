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
  verify,
  verifyAdmin,
  productController.updateProduct
);

// Route for Archiving a product
router.patch(
  "/:productId/archive",
  verify,
  verifyAdmin,
  productController.archiveProduct
);

// Route for Activating a product
router.patch(
  "/:productId/activate",
  verify,
  verifyAdmin,
  productController.activateProduct
);

// Route to search for product by name
router.post('/search-by-name', productController.searchByName);

// Route to search for product by price range
router.post('/search-by-price', productController.searchByPrice);

module.exports = router;
