// Setting up ExpressJS Server
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
require("dotenv").config();

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS options
const corsOptions = {
  origin: ["http://localhost:8000"],
  credentials: true, // Fix typo: should be 'credentials'
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

// User routes
app.use("/users", userRoutes);
// User routes
app.use("/products", productRoutes);
// Cart routes
app.use("/cart", cartRoutes);

// Start the server
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API is now available on port ${port}`));
}

module.exports = { app, mongoose };
