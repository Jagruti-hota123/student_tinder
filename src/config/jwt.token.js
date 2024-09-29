const Jwt = require("jsonwebtoken");

const generateToken = async (id) =>
  await Jwt.sign({ id }, "hiubd", { expiresIn: "1d" });

export { generateToken };

module.exports = { generateToken };
