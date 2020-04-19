const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonData = require("./data.json");
const Contact = require("./models/contact");

app.set("view engine", "ejs");
app.use(express.static("./assets"));

// Home Route
app.get("/", (req, res) => {
  Contact.find({})
    .sort({ name: 1 })
    .select("name avatar")
    .then(result => {
      // If mongodb is empty create new data coming from JSON file (data.json)
      if (result.length <= 0) {
        Contact.create(jsonData)
          .then(() => res.redirect("/"))
          .catch(err => console.log(err));
        // If mongodb has a data then get the data then render
      } else {
        res.render("index", { data: result });
      }
    })
    .catch(err => console.log(err));
});

// Contact View Route
app.get("/contact/:id/view", (req, res) => {
  Contact.findOne({ _id: req.params.id })
    .then(result => res.render("view", { person: result }))
    .catch(err => {
      console.log(err);
      res.status(400).render("error", {
        Error: { code: 400, status: err.name, message: err.message }
      });
    });
});

// Delete Contact Route
app.post("/contact/:id/delete", (req, res) => {
  Contact.deleteOne({ _id: req.params.id })
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});

// Create Contact Route
app.get("/contact/create", (req, res) => {
  res.render("create");
});

// Save Contact Route
app.post("/contact/save", urlencodedParser, (req, res) => {
  Contact.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});

// Edit Contact Route
app.get("/contact/:id/edit", (req, res) => {
  Contact.findOne({ _id: req.params.id })
    .then(result => res.render("update", { person: result }))
    .catch(err => {
      console.log(err);
      res.status(400).render("error", {
        Error: { code: 400, status: err.name, message: err.message }
      });
    });
});

// Update Contact Route
app.post("/contact/:id/update", urlencodedParser, (req, res) => {
  Contact.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});

// Search Contact Route
app.post("/contact/search", urlencodedParser, (req, res) => {
  Contact.find()
    .select("name avatar")
    .then(result => {
      const searched = result.filter(person => {
        const personLC = person.name.toLowerCase();
        const searchLC = req.body.search.toLowerCase();
        return personLC.includes(searchLC);
      });
      if (req.body.search === "") {
        res.redirect("/");
      } else {
        res.render("index", { data: searched });
      }
    })
    .catch(err => console.log(err));
});

// 404 Page Not Found Route
app.get("*", (req, res) => {
  res.status(404).render("error", {
    Error: { code: 404, status: "Not Found", message: "Page Not Found!" }
  });
});

// Listen to Port 3000
app.listen(3000, () => {
  console.log("Listening on Port 3000...");
});
