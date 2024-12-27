const express = require("express");
const authRouter = express.Router();
// const router = express.Router();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validateSchemaData } = require("../utils/validation");
const bcrypt = require("bcrypt");

//post method for signup
authRouter.post("/signup", async (req, res) => {
  //creating a new instance of the user model
  try {
    const { firstName, lastName, password, emailId } = req.body;
    //Validation of Data
    validateSchemaData(req);

    //encrypt the password
    const encryptPass = await bcrypt.hash(password, 10);
    console.log(password);

    const data = await User.create({
      emailId,
      firstName,
      lastName,
      password: encryptPass,
    });
    const savedUser = await data.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    if (!savedUser) {
      res.status(500).json({ msg: "Something went wrong" });
    } else {
      res
        .status(200)
        .json({ msg: "User Created Successfully", data: savedUser });
    }
  } catch (error) {
    res.status(400).send("Error saving the user  --" + error.message);
  }
});

//post method for login
authRouter.post("/login", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { password, emailId } = req.body;

    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email Id" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    const token = await user.getJWT();
    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    return res.status(200).json({
      msg: "Login successful",
      data: user,
      token,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(400).json({ msg: `Error: ${error.message}` });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged Out SuccessFully");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = authRouter;
