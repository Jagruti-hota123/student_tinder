const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//To send connection Request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  // res.send(user.firstName + "Sent the connection request");
  res
    .status(200)
    .json({ msg: `${user.firstName} sent the connection request` });
});
module.exports = requestRouter;
