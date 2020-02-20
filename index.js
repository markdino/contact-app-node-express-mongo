const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Home route");
});

app.listen(3000, () => {
  console.log("Listening on Port 3000...");
});
