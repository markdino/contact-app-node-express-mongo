const express = require("express");
const passport = require('../middleware/passportSetup')
const cors = require("../middleware/corsSetup");

module.exports = app => {
    app.set("view engine", "ejs");
    app.use(express.static("./assets"));
    passport.setup(app);
    app.use(express.json());
    cors.setup(app);
}