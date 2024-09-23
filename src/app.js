const express = require("express");

const app = express(); //Invoke the express function to create an instance
app.get("/home", (req, res) => {
  res.send("This is for the homepage");
});

app.get("/start", (req, res) => {
  res.send("This is for the main page");
});
app.use((req, res) => {
  res.send("Hello from the server");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
