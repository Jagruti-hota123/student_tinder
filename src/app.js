const express = require("express");

const app = express(); //Invoke the express function to create an instance

//this will only handle GET call to /user
app.get("/user", (req, res) => {
  res.send({ firstname: "Jagruti", lastName: "Hota" });
});

app.post("/user", (req, res) => {
  //data saved to DB
  res.send("Data successfully saved to the database!");
});

app.patch("/user", (req, res) => {
  //changing
  res.send("Changed by patch method");
});

app.delete("/user", (req, res) => {
  res.send("Deleted Successfully");
});

app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
