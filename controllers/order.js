const Order = require("../models/Order.js");
const auth = require("../auth.js");
const { errorHandler } = auth;

//Retrieve all user's orders
module.exports.getAllOrders = (req, res) => {
  return Order.find({})
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send({ orders: result });
      } else {
        return res.status(404).send({ message: "No order found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
