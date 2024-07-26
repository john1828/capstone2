const express = require("express");
const productController = require("../controllers/product.js");
const { verify, verifyAdmin } = require("../auth.js");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Set up storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

//[SECTION] Route for creating product
router.post(
  "/",
  verify,
  verifyAdmin,
  upload.single("image"),
  productController.addProduct
);

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
  upload.single("image"),
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
router.post("/search-by-name", productController.searchByName);

// Route to search for product by price range
router.post("/search-by-price", productController.searchByPrice);

module.exports = router;
