const router = require("express").Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const Contact = require("../models/contact");
const { search, errorAlert } = Contact;

// Public contacts
router.get("/", (req, res) => {
  Contact.find({ private: false })
    .sort({ name: 1 })
    .select("name avatar")
    .then((result) => {
      res.render("index", { data: result, user: req.user, status: "public" });
    })
    .catch((err) => {
      res.status(400).render("error", errorAlert(400, err.name, err.message));
    });
});

// Search public contacts
router.post("/search", urlencodedParser, (req, res) => {
  const query = req.body.search
  Contact.find({ private: false })
    .select("name avatar")
    .then((result) => {
      search(result, query, req, res, {
        emptyRedirect: "/",
        render: "index",
        status: "public",
      });
    })
    .catch((err) => {
      res.status(400).render("error", errorAlert(400, err.name, err.message));
    });
});

module.exports = router;
