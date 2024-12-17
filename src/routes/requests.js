const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

//To send connection interested or ignored Request
requestRouter.post(
  "/request/send/:status/:receiverId",
  userAuth,
  async (req, res) => {
    try {
      const receiverId = req.params.receiverId;
      const senderId = req.user._id; //getting user from userAuth
      const status = req.params.status;

      const connectionRequest = new ConnectionRequest({
        senderId,
        receiverId,
        status,
      });
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request Already Exists",
        });
      }

      await connectionRequest.save();
      res.status(200).json({
        message: `${req.user.firstName}'s ${req.params.status} Connection Request Sent Successfully to ${receiverId.firstName}`,
        data: connectionRequest,
      });
    } catch (error) {
      res.status(400).json({ message: `Error---- ${error.message}` });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //Check whether the status is valid or not
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status is not valid!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        receiverId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        res.status(400).json({ message: "Request Doesn't exists" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(400).json({
        message: `Connection successfully ${status}`,
        data: data,
      });
    } catch (error) {
      res.send(400).send("Error" + error);
    }
  }
);
module.exports = requestRouter;
