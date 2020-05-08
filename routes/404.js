const router = require("express").Router();
const { errorAlert } = require("../models/contact");

router.get("*", (req, res) => {
  res
    .status(404)
    .render("error", errorAlert(404, "Not Found", "Page Not Found!"));
});

module.exports = router;
