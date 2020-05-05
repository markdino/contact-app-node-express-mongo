const express = require("express");
const app = express();
const dbMongoose = require("./db/mongoose");
const contact = require("./routes/contact");
const user = require("./routes/user");
const pageNotFound = require("./routes/404");
const passportSetup = require("./startups/passportSetup");

app.set("view engine", "ejs");
app.use(express.static("./assets"));

// Startups
passportSetup(app);

// DataBase connection
dbMongoose.connect();

// Routes
app.use("/contact", contact);
app.use("/user", user);
app.use(pageNotFound);

// Listen to Port 3000
app.listen(3000, () => {
  console.log("Listening on Port 3000...");
});
