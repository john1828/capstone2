const express = require("express");
const userController = require("../controllers/user.js");
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// Routes

// For registering a user
router.post("/register", userController.registerUser);
// For log in
router.post("/login", userController.loginUser);
// for retrieving user details
router.get("/details", verify, userController.getProfile);
// for updating user as admin
router.patch(
  "/:userId/set-as-admin",
  verify,
  verifyAdmin,
  userController.updateAsAdmin
);

// for updating password
router.patch("/update-password", verify, userController.updatePassword);

module.exports = router;
