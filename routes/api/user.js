const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/user");
const { payload, filter } = require("../../models/contact");
const protectedApi = require('../../middleware/protectedApi')

// Current user
router.get('/me', protectedApi, (req, res) => {
  res.send(payload(null, filter(req.user, '_id username'), 'Current user'))
})

// Sign Up
router.post("/signup", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err)
        return res
          .status(400)
          .send(payload(err.message, null, err.name));
      passport.authenticate("local")(req, res, () => {
        res.send(payload(null, filter(user, '_id username'), 'New User Added'))
      });
    }
  );
});

// Login
router.post("/login", (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (!user)
      return res.status(401).send(payload(info.message, null, info.name));

    req.logIn(user, err => {
      if (err) return res.status(400).send(payload(err, null, 'Bad request'));

      res.send(payload(null, filter(user, '_id username'), 'Login Success'))
    });
  })(req, res)
});

// LogOut
router.get("/logout", (req, res) => {
  req.logout();
  res.send(payload(null, 'Logout success.', 'Logout'));
});
module.exports = router;
