const express = require("express");
const passport = require('../middleware/passportSetup')
const cors = require("cors");

module.exports = app => {
    app.set("view engine", "ejs");
    app.use(express.static("./assets"));
    passport.setup(app);
    app.use(express.json());
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true,
    }));
}