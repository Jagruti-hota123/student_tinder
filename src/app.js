const express = require("express");
const app = express(); //Invoke the express function to create an instance
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSchemaData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());
//post method for signup
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successful");
    } else {
      res.status(400).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json({ msg: `ERROR -- ${error.message}` });
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
    if (!users) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//update users by using put
app.put("/user/:id", async (req, res, next) => {
  try {
    const givenId = req.params.id;
    const data = req.body;

    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    // Check if all fields in req.body are allowed updates
    const isUpdateAllowed = Object.keys(data).every((k) => {
      return ALLOWED_UPDATES.includes(k);
    });

    // If any of the updates are not allowed, throw an error
    if (!isUpdateAllowed) {
      return res.status(400).json({ error: "Changes not allowed" });
    }

    // Find the user and update
    const findUser = await User.findByIdAndUpdate(
      givenId,
      { ...data },
      { new: true }
    );

    // Check if the user was found and updated
    if (!findUser) {
      return res.status(404).json({ msg: "User not found" });
    } else {
      res
        .status(200)
        .json({ msg: "User data updated successfully", data: findUser });
    }
  } catch (error) {
    console.error(error); // Optional: Log the error for debugging purposes
    res.status(400).send("Error");
  }
});
app.patch("/user/:id", async (req, res) => {
  try {
    const givenId = req.params.id;
    const updateUser = await User.findByIdAndUpdate(
      givenId,
      { ...req.body },
      { new: true }
    );
    if (!updateUser) {
      res
        .status(404)
        .json({ msg: "User Data updated using Patch", data: updateUser });
    } else {
      res
        .status(200)
        .json({ msg: "Data updated successfully", data: updateUser });
    }
  } catch (error) {
    next(error);
  }
});
app.delete("/user", async (req, res) => {
  const givenId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(givenId);
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send("Data Deleted Successfully");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

//Connection to the database
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
