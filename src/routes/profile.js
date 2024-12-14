const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//get method to see profile of specific user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).json({ msg: `Error---- ${error.message}` });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileData(req);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = profileRouter;
