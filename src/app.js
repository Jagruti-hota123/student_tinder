const express = require("express");
const app = express(); //Invoke the express function to create an instance
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/requests");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const cors = require("cors");

//to read response in json
app.use(express.json());
//to parse or read the cookies
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
//Connection to the database
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log(
        `Server is successfully listening on port http://localhost:3000`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
