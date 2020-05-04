const express = require("express");
const app = express();
const dbMongoose = require("./db/mongoose");
const contact = require("./routes/contact");
const pageNotFound = require("./routes/404");

app.set("view engine", "ejs");
app.use(express.static("./assets"));

// DataBase connection
dbMongoose.connect();

// Routes
app.use("/contact", contact);
app.use(pageNotFound);

// Listen to Port 3000
app.listen(3000, () => {
  console.log("Listening on Port 3000...");
});
