const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Retrieve the Authorization header

    // Check if the Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ message: "Authorization token is missing or invalid" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token from the header
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
