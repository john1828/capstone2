// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user.js");
const { verify, verifyAdmin} = require("../auth.js");
const router = express.Router();



//[SECTION] Route for retrieving user details
router.get("/details", verify, userController.getProfile);

//[SECTION] Route for updating user as admin
router.patch('/:userId/set-as-admin', verify, verifyAdmin, userController.updateAsAdmin);

//[SECTION] Route for updating password
router.patch('/update-password', verify, userController.updatePassword);

// [SECTION] Export Route System
module.exports = router;