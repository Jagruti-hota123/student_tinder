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
      emailId,
      password: encryptPass,
    });
    if (!data) {
      res.status(500).json({ msg: "Something went wrong" });
    } else {
      res.status(200).json({ msg: "User Created Successfully", data: data });
    }
    res.send("User added Successfully");
  } catch (error) {
    res.status(400).send("Error saving the user  --" + error.message);
  }
});

//post method for login
authRouter.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("EMail Id is not valid");
    }
    //check if emailId already exists or not
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    //if user is there check the password is correct or not
    const isPasswordValid = await user.validatePassword;
    if (!isPasswordValid) {
      throw new error("Invalid credentials");
    } else {
      //create jwt token
      const token = await user.getJWT();
      //store it inside a cookie
      res.cookie("token", token);
      res.send("login Successful");
    }
  } catch (error) {
    res.status(400).json({ msg: `error--- ${error.message}` });
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
