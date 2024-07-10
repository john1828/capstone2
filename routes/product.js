const express = require("express");
const productController = require("../controllers/product.js");
const { verifyAdmin } = require("../auth.js");

const router = express.Router();

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
