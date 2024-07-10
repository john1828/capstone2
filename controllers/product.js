const Product = require("../models/Product.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const { errorHandler } = auth;

//[SECTION] Create a product
module.exports.addProduct = (req, res) => {
    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });
    Product.findOne({ name:req.body.name })
    .then(existingProduct => {
        if(existingProduct){
            return res.status(409).send({message: "Product is already exist"})
        } else {
            return newProduct.save()
            .then(savedProduct => res.send({
                product: newProduct
            }))
            .catch(err => errorHandler(err, req, res));
        }
    }).catch(err => errorHandler(err, req, res));
}; 

//[SECTION] Retrieve all products
module.exports.getAllProduct = (req, res) => {
    return Product.find({})
    .then(result => {
        if(result.length > 0){
            return res.status(200).send({ products: result });
        }
        else{
            return res.status(404).send({message: 'No product found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

//[SECTION] Retrieve all active products
module.exports.getActiveProduct = (req, res) => {
    Product.find({ isActive: true })
    .then(result => {
        if(result.length > 0){
            return res.status(200).send({ products: result });
        } else {
            return res.status(404).send({message: 'No active product found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};