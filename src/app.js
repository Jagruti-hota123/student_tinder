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
//get one user from the database
app.get("/user", async (req, res) => {
  const firstName_1 = req.body.firstName;
  try {
    const users = await User.find({ firstName: firstName_1 });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//get users by Id

app.get("/user/:id", async (req, res) => {
  const givenId = req.params.id;
  try {
    const users = await User.findById(givenId);
    if (users.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put("/user/:id", async (req, res, next) => {
  try {
    const givenId = req.params.id;
    const findUser = await User.findByIdAndUpdate(
      givenId,
      { ...req.body },
      { new: true }
    );
    if (!findUser) {
      res.status(404).json({ msg: "User not found" });
    } else {
      res
        .status(200)
        .json({ msg: "User data updated successfully", data: findUser });
    }
  } catch (error) {
    next(error);
  }
});

app.patch("/user/:id", async (req, res) => {
  try {
    const givenId = req.params.id;
    const updateUser = await User.findByIdAndUpdate(
      { givenId },
      { ...req.body },
      { data: updateUser }
    );
    if (!updateUser) {
      res
        .status(404)
        .json({ msg: "User Data updated using Patch", data: updateUser });
    }
  } catch (error) {
    next(error);
  }
});
app.delete("/user", async (req, res) => {
  const givenId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(givenId);
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send("Data Deleted Successfully");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

//post method to send user data

//update
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
