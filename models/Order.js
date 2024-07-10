const mongoose = require("mongoose"); 

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is Required"]
  },
  productsOrdered:[
  	{
  		productId:{
  			type: String,
    		required: [true, "Product Id is Required"]
  		} ,
  		quantity: Number,
  		subtotal: Number
  	}
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total Price is Required"]
  },
  orderOn: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "Pending"
  }
});

 module.exports = mongoose.model("Order", orderSchema); 