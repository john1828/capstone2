const Product = require("../models/Product.js");
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
  let updateActiveField = {
    isActive: false,
  };

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then((product) => {
      if (product) {
        if (!product.isActive) {
          return res.status(200).send({
            message: "Product archive successfully",
            archiveProduct: product,
          });
        }
        return res.status(200).send({
          success: true,
          message: "Product archived successfully",
        });
      } else {
        return res.status(404).send({ error: "Product not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Controller function for activating a product
module.exports.activateProduct = (req, res) => {
  let updateActiveField = {
    isActive: true,
  };

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then((product) => {
      if (product) {
        if (product.isActive) {
          return res.status(200).send({
            message: "Product activated successfully",
            activateProduct: product,
          });
        }
        return res.status(200).send({
          success: true,
          message: "Product activated successfully",
        });
      } else {
        return res.status(404).send({ error: "Product not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
