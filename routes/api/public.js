const router = require("express").Router();
const Contact = require("../../models/contact");
const { search, payload } = Contact;

// Public contacts
router.get("/", (req, res) => {
  Contact.find({ private: false })
    .sort({ name: 1 })
    .select("name avatar")
    .then(result => res.send(payload(null, result, 'Contact')))
    .catch(err => {
      res.status(400).send(payload(err.message, null, err.name));
    });
});

// Search public contacts
router.get("/search", (req, res) => {
  const query = req.query.name
  if (!query)
    return res.status(400).send(payload("No query", null, "Bad request"));

  Contact.find({ private: false })
    .select("name avatar")
    .then(result => res.send(
      payload(null, search(result, query), 'Search contact'))
    )
    .catch(err => {
      res.status(400).send(payload(err.message, null, err.name));
    });
});

module.exports = router;
