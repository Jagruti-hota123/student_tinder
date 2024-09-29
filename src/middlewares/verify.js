const Jwt = require("jsonwebtoken");
const User = require("./models/user");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.json({
        msg: "There is no token attached to headers",
      });
    }
    const decoded = await Jwt.verify(token, "hiubd");
    const user = await User.findById(decoded?.id);
    req.user = user;
    // console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    res.json({ msg: error.message });
  }
};
const isAdmin = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser?.role !== "ADMIN") {
    res.json({ msg: "You are not admin" });
  } else {
    next();
  }
};
const loginAccess = async (req, res, next) => {
  const { email } = req.user;
  const searchUser = await User.findOne({ email });
  if (!searchUser?.isRegistered) {
    res.json({ msg: "User is not registered" });
  } else {
    next();
  }
};
module.exports = { verifyToken, isAdmin, loginAccess };
