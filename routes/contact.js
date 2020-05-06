const router = require("express").Router();
const jsonData = require("../data.json");
const Contact = require("../models/contact");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const isLoggedIn = require("../middleware/isLoggedIn");
const search = require("../middleware/search");

// My contacts
router.get("/", isLoggedIn, (req, res) => {
  Contact.find({ owner: req.user._id })
    .sort({ name: 1 })
    .select("name avatar")
    .then(result => {
      res.render("index", {
        data: result,
        user: req.user,
        status: "mycontact"
      });
    })
    .catch(err => {
      res.status(400).render("error", {
        Error: {
          code: 400,
          status: err.name,
          message: err.message
        }
      });
    });
});

// Private contacts
router.get("/private", isLoggedIn, (req, res) => {
  Contact.find({ owner: req.user._id, private: true })
    .sort({ name: 1 })
    .select("name avatar")
    .then(result => {
      res.render("index", {
        data: result,
        user: req.user,
        status: "private"
      });
    })
    .catch(err => {
      res.status(400).render("error", {
        Error: {
          code: 400,
          status: err.name,
          message: err.message
        }
      });
    });
});

// Contact View
router.get("/:id/view", isLoggedIn, (req, res) => {
  Contact.findOne({ _id: req.params.id })
    .then(result => {
      result
        ? res.render("view", { person: result })
        : res.status(404).render("error", {
            Error: {
              code: 404,
              status: "Not Found",
              message: "Contact not found or invalid id."
            }
          });
    })
    .catch(err => {
      res.status(400).render("error", {
        Error: {
          code: 400,
          status: "Bad request",
          message: `${err.name}. "${err.value}" is invalid.`
        }
      });
    });
});

// Delete Contact
router.post("/:id/delete", isLoggedIn, (req, res) => {
  Contact.deleteOne({ _id: req.params.id })
    .then(response => {
      response.deletedCount > 0
        ? res.redirect("/contact")
        : res.status(400).render("error", {
            Error: {
              code: 404,
              status: "Not Found",
              message: "Contact already been deleted."
            }
          });
    })
    .catch(err => {
      res.status(400).render("error", {
        Error: {
          code: 400,
          status: "Bad request",
          message: `${err.name}. "${err.value}" is invalid.`
        }
      });
    });
});

// Create Contact
router.get("/create", isLoggedIn, (req, res) => {
  res.render("create");
});

// Save Contact
router.post("/save", [urlencodedParser, isLoggedIn], (req, res) => {
  req.body.owner = req.user._id;
  req.body.private = req.body.private === "on" ? true : false;

  Contact.create(req.body)
    .then(() => res.redirect("/contact"))
    .catch(err => {
      res.status(400).render("error", {
        Error: { code: 400, status: err.name, message: err.message }
      });
    });
});

// Edit Contact
router.get("/:id/edit", isLoggedIn, (req, res) => {
  Contact.findOne({ _id: req.params.id })
    .then(result => {
      result
        ? res.render("update", { person: result })
        : res.status(404).render("error", {
            Error: {
              code: 404,
              status: "Not Found",
              message: "Contact not found."
            }
          });
    })
    .catch(err => {
      res.status(400).render("error", {
        Error: {
          code: 400,
          status: "Bad request",
          message: `${err.name}. "${err.value}" is invalid.`
        }
      });
    });
});

// Update Contact
router.post("/:id/update", [urlencodedParser, isLoggedIn], (req, res) => {
  req.body.private = req.body.private === "on" ? true : false;
  Contact.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(response => {
      response.nModified > 0
        ? res.redirect("/contact")
        : res.status(404).render("error", {
            Error: {
              code: 404,
              status: "Not Found",
              message: "Contact doesn't exist anymore."
            }
          });
    })
    .catch(err => {
      res.status(400).render("error", {
        Error: {
          code: 400,
          status: "Bad request",
          message: `${err.name}. "${err.value}" is invalid.`
        }
      });
    });
});

// Search Contact
router.post("/search", [urlencodedParser, isLoggedIn], (req, res) => {
  Contact.find({ owner: req.user._id })
    .select("name avatar")
    .then(result => {
      search(result, req, res, {
        emptyRedirect: "/contact",
        render: "index",
        status: "mycontact"
      });
    })
    .catch(err => {
      res.status(400).render("error", {
        Error: {
          code: 400,
          status: err.name,
          message: err.message
        }
      });
    });
});

router.post("/private/search", [urlencodedParser, isLoggedIn], (req, res) => {
  Contact.find({ owner: req.user._id, private: true })
    .select("name avatar")
    .then(result => {
      search(result, req, res, {
        emptyRedirect: "/contact/private",
        render: "index",
        status: "private"
      });
    })
    .catch(err => {
      res.status(400).render("error", {
        Error: {
          code: 400,
          status: err.name,
          message: err.message
        }
      });
    });
});

module.exports = router;
