const express = require("express");
const app = express(); //Invoke the express function to create an instance
// const { adminAuth, userAuth } = require("./middlewares/auth");
// app.use("/admin", adminAuth);

//error handling
app.use("/getAllData", (req, res, next) => {
  throw new Error("jhbsujbxjuhb");
  res.send("User Data Sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.send(500).send("something went wrong");
  }
});
app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
