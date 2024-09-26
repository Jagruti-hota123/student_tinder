const express = require("express");
const app = express(); //Invoke the express function to create an instance
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  //creating a new instance of the user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added Successfully");
  } catch (error) {
    res.status(400).send("Error saving the user" + error.message);
  }
});
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
