const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");
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

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

mongoose.connect(process.env.MONGODB_STRING, mongooseOptions);

mongoose.connection.on("connected", () => {
  console.log("Now connected to MongoDB Atlas");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// User routes
app.use("/b4/users", userRoutes);
// Product routes
app.use("/b4/products", productRoutes);
// Cart routes
app.use("/b4/carts", cartRoutes);
// Order routes
app.use("/b4/orders", orderRoutes);

// Start the server

const port = process.env.PORT;
app.listen(port, () => console.log(`API is now available on port ${port}`));
