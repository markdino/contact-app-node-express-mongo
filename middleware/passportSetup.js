require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");

module.exports.setup = (app) => {
  app.use(
    require("express-session")({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
