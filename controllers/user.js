 // [SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require("../models/User.js");
const auth = require("../auth.js");
const { errorHandler } = auth;


// [SECTION] Controller function to retrieving user details
module.exports.getProfile = (req, res) => {
	return User.findById(req.body.id)
	.then(user => {
		if(!user){
			return res.status(404).send({ error: 'User not found' })
		}else {
			return res.status(200).send({user: user});
		}  
	})
	.catch(error => errorHandler(error, req, res));
};

//[SECTION] Controller function to update another user as an admin
module.exports.updateAsAdmin = async (req, res) => {
    try {
        const { id } = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        user.isAdmin = true;
        await user.save();
        res.status(200).json({ updatedUser: user });
    } catch (error) {
        res.status(500).json({ error: 'Failed in Find', details: error.message });
    }
};  

//[SECTION] Function to update password
module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};