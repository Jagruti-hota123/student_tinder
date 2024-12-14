const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // Ensure cookie-parser middleware is used in the app
    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedObj = await jwt.verify(token, "DEV_STUDENT@123"); // Verify token
    const { _id } = decodedObj; // Extract the user id from token payload

    // Find the user by id
    const user = await User.findById(_id); // findById expects just the id, no need for an object
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // Assign user to req.user
    next(); // Call next after setting req.user
  } catch (error) {
    res.status(400).json({ msg: `Error--- ${error.message}` });
  }
};

module.exports = {
  userAuth,
};
