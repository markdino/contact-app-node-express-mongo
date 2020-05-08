const express = require("express");
const app = express();
const dbMongoose = require("./db/mongoose");
const passportSetup = require("./startups/passportSetup");
const routes = require("./startups/routes");
const server = require("./startups/server");

app.set("view engine", "ejs");
app.use(express.static("./assets"));

// Startups
dbMongoose.connect();
passportSetup(app);
routes(app);
server.start(app);
