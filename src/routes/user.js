const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      receiverId: loggedInUser._id,
      status: "interested",
    }).populate("senderId", " firstName lastName age address about skills");
    //}).populate("receiverId", ["firstName", "lastName"])
    
    res
      .status(200)
      .json({ message: "Data received Successfully", data: connectionRequest });
  } catch (error) {
    res.status(400).send("Error" + error);
  }
});

module.exports = userRouter;
