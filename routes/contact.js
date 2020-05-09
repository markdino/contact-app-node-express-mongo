const router = require("express").Router();
const Contact = require("../models/contact");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const isLoggedIn = require("../middleware/isLoggedIn");
const { search, errorAlert } = Contact;

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
      res.status(400).render("error", errorAlert(400, err.name, err.message));
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
      res.status(400).render("error", errorAlert(400, err.name, err.message));
    });
});

// Contact details View
router.get("/:id/view", (req, res) => {
  Contact.findById(req.params.id)
    .then(result => {
      if (result.private) {
        if (!req.user) return res.redirect("/user/login");
        if (result.owner.toString() !== req.user._id.toString())
          return res
            .status(403)
            .render("error", errorAlert(403, "Forbidden", "Access denied."));
      }

      result
        ? res.render("view", { person: result })
        : res
            .status(404)
            .render(
              "error",
              errorAlert(404, "Not Found", "Contact not found or invalid id.")
            );
    })
    .catch(err => {
      res
        .status(400)
        .render(
          "error",
          errorAlert(
            400,
            "Bad request",
            `${err.name}. "${err.value}" is invalid.`
          )
        );
    });
});

// Delete Contact
router.post("/:id/delete", isLoggedIn, async (req, res) => {
  const result = await Contact.findById(req.params.id);
  if (result.owner.toString() !== req.user._id.toString())
    return res
      .status(403)
      .render("error", errorAlert(403, "Forbidden", "Access denied."));

  Contact.deleteOne({ _id: req.params.id })
    .then(response => {
      response.deletedCount > 0
        ? res.redirect("/contact")
        : res
            .status(400)
            .render(
              "error",
              errorAlert(404, "Not Found", "Contact already been deleted.")
            );
    })
    .catch(err => {
      res
        .status(400)
        .render(
          "error",
          errorAlert(
            400,
            "Bad request",
            `${err.name}. "${err.value}" is invalid.`
          )
        );
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
      res.status(400).render("error", errorAlert(400, err.name, err.message));
    });
});

// Edit Contact
router.get("/:id/edit", isLoggedIn, (req, res) => {
  Contact.findById(req.params.id)
    .then(result => {
      if (result.owner.toString() !== req.user._id.toString())
        return res
          .status(403)
          .render("error", errorAlert(403, "Forbidden", "Access denied."));

      result
        ? res.render("update", { person: result })
        : res
            .status(404)
            .render(
              "error",
              errorAlert(404, "Not Found", "Contact not found.")
            );
    })
    .catch(err => {
      res
        .status(400)
        .render(
          "error",
          errorAlert(
            400,
            "Bad request",
            `${err.name}. "${err.value}" is invalid.`
          )
        );
    });
});

// Update Contact
router.post("/:id/update", [urlencodedParser, isLoggedIn], async (req, res) => {
  const result = await Contact.findById(req.params.id);
  if (result.owner.toString() !== req.user._id.toString())
    return res
      .status(403)
      .render("error", errorAlert(403, "Forbidden", "Access denied."));

  req.body.private = req.body.private === "on" ? true : false;
  Contact.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(response => {
      response.nModified > 0
        ? res.redirect("/contact")
        : res
            .status(404)
            .render(
              "error",
              errorAlert(404, "Not Found", "Contact doesn't exist anymore.")
            );
    })
    .catch(err => {
      res
        .status(400)
        .render(
          "error",
          errorAlert(
            400,
            "Bad request",
            `${err.name}. "${err.value}" is invalid.`
          )
        );
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
      res.status(400).render("error", errorAlert(400, err.name, err.message));
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
      res.status(400).render("error", errorAlert(400, err.name, err.message));
    });
});

module.exports = router;
