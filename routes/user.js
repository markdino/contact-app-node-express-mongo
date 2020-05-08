const router = require("express").Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const passport = require("passport");
const User = require("../models/user");
const { errorAlert } = require("../models/contact");

// Sign Up
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", urlencodedParser, (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err)
        return res
          .status(400)
          .render("error", errorAlert(400, err.name, err.message));
      passport.authenticate("local")(req, res, () => res.redirect("/contact"));
    }
  );
});

// Login
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", [
  urlencodedParser,
  passport.authenticate("local", {
    successRedirect: "/contact",
    failureRedirect: "/user/login",
  }),
]);

// LogOut
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
