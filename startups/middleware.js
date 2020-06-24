const express = require("express");
const passport = require('../middleware/passportSetup')
const cors = require("cors");

module.exports = app => {
    app.set("view engine", "ejs");
    app.use(express.static("./assets"));
    app.use(cors());
    passport.setup(app);
    app.use(express.json());
}