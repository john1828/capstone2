const Product = require("../models/Product.js");
const Cart = require("../models/Cart.js");
const { errorHandler } = require("../auth");

//[SECTION] Create a product
module.exports.addProduct = (req, res) => {
  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  });
  Product.findOne({ name: req.body.name })
    .then((existingProduct) => {
      if (existingProduct) {
        return res.status(409).send({ message: "Product is already exist" });
      } else {
        return newProduct
          .save()
          .then((savedProduct) =>
            res.send({
              product: newProduct,
            })
          )
          .catch((err) => errorHandler(err, req, res));
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

//[SECTION] Retrieve all products
module.exports.getAllProduct = (req, res) => {
  return Product.find({})
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send({ products: result });
      } else {
        return res.status(404).send({ message: "No product found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Retrieve all active products
module.exports.getActiveProduct = (req, res) => {
  Product.find({ isActive: true })
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send({ products: result });
      } else {
        return res.status(404).send({ message: "No active product found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Controller function for retrieving a single product
module.exports.retrieveSingleProduct = (req, res) => {
  Product.findById(req.params.productId)
    .then((retrievedProduct) => {
      if (retrievedProduct) {
        return res.status(200).send({
          product: retrievedProduct,
        });
      } else {
        return res.status(404).send({ error: "Product not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Controller function for updating a product information
module.exports.updateProduct = (req, res) => {
  let UpdatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };

  Product.findByIdAndUpdate(req.params.productId, UpdatedProduct)
    .then((product) => {
      if (product) {
        return res.status(200).send({
          message: "Product updated successfully",
          updatedProduct: product,
        });
      } else {
        return res.status(404).send({
          error: "Product not found",
        });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Controller function for archiving a product
module.exports.archiveProduct = (req, res) => {
  Product.findByIdAndUpdate(
    req.params.productId,
    { isActive: false },
    { new: true }
  )
    .then((product) => {
      if (product) {
        return res.status(200).send({
          message: "Product archive successfully",
          archiveProduct: product,
        });
      } else {
        return res.status(404).send({ error: "Product not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Controller function for activating a product
module.exports.activateProduct = (req, res) => {
  Product.findByIdAndUpdate(
    req.params.productId,
    { isActive: true },
    { new: true }
  )
    .then((product) => {
      if (product) {
        return res.status(200).send({
          message: "Product activated successfully",
          activateProduct: product,
        });
      } else {
        return res.status(404).send({ error: "Product not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Search product by name
module.exports.searchByName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Product name is required' });
        }

        const products = await Product.find({ name });
        
        if (products.length === 0) {
            return res.status(404).json({ error: 'No product found' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for products' });
    }
};

// Search product by price range
module.exports.searchByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.body;

  if (minPrice === undefined || maxPrice === undefined) {
    return res.status(400).json({ error: 'Minimum Price and Max Price are required' });
  }

  try {
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for products' });
  }
};