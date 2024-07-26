const Product = require("../models/Product.js");
const { errorHandler } = require("../auth");

// Create a product
module.exports.addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Check if product with the same name already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(409).send({ message: "Product already exists" });
    }

    // Create new product instance
    const newProduct = new Product({
      name,
      description,
      price,
      image: req.file.path,
    });

    // Save product to database
    const savedProduct = await newProduct.save();

    res.status(201).send(savedProduct);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Retrieve all products
module.exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    if (products.length > 0) {
      res.status(200).send(products);
    } else {
      res.status(404).send({ message: "No products found" });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Retrieve all active products
module.exports.getActiveProduct = async (req, res) => {
  try {
    const activeProducts = await Product.find({ isActive: true });
    if (activeProducts.length > 0) {
      res.status(200).send(activeProducts);
    } else {
      res.status(404).send({ message: "No active products found" });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Retrieve a single product by ID
module.exports.retrieveSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Update a product by ID
module.exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price } = req.body;

    // Check if a new image file is uploaded
    let updateData = { name, description, price };
    if (req.file) {
      updateData.image = req.file.path;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );
    if (updatedProduct) {
      res
        .status(200)
        .send({ message: "Product updated successfully", updatedProduct });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Archive a product by ID
module.exports.archiveProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const archivedProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );
    if (archivedProduct) {
      res
        .status(200)
        .send({ message: "Product archived successfully", archivedProduct });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Activate a product by ID
module.exports.activateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const activatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isActive: true },
      { new: true }
    );
    if (activatedProduct) {
      res
        .status(200)
        .send({ message: "Product activated successfully", activatedProduct });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Search product by name
module.exports.searchByName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ error: "Product name is required" });
    }
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    if (products.length === 0) {
      return res.status(404).send({ message: "No product found" });
    }
    res.status(200).send(products);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Search product by price range
module.exports.searchByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;
    if (minPrice === undefined || maxPrice === undefined) {
      return res
        .status(400)
        .send({ error: "Minimum Price and Max Price are required" });
    }
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
    res.status(200).send(products);
  } catch (error) {
    errorHandler(error, req, res);
  }
};
