const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

//get method to see profile of specific user

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).send("Invalid Edit Request");
    }
    const loggedInuser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));
    console.log(loggedInuser);
    await loggedInuser.save();
    res.status(200).json({
      message: `${loggedInuser.firstName}'s Profile Updated Successfully`,
      data: loggedInuser,
    });

    // console.log(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).json({ msg: `Error---- ${error.message}` });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  //To change password
  try {
    const { oldPassword, newPassword } = req.body;

    // Input Validation
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Both old and new passwords are required." });
    }

    const loggedInUser = req.user;

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, loggedInUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old password is incorrect." });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    loggedInUser.password = hashedNewPassword;
    await loggedInUser.save();

    res.status(200).json({ msg: "Password changed successfully." });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = profileRouter;
