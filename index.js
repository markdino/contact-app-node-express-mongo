const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonData = require("./data.json");

app.set("view engine", "ejs");
app.use(express.static("./assets"));

const data = jsonData;

app.get("/", (req, res) => {
  data.sort(function(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  res.render("index", { data });
});

app.get("/contact/:id/view", (req, res) => {
  const newData = data.find(person => person.id === Number(req.params.id));
  res.render("view", { person: newData });
});

app.post("/contact/:id/delete", (req, res) => {
  data.splice(
    data.findIndex(person => person.id === Number(req.params.id)),
    1
  );
  res.redirect("/");
});

app.get("/contact/create", (req, res) => {
  let id = 1;
  data.forEach(person => {
    if (person.id >= id) {
      id = person.id + 1;
    }
  });
  res.render("create", { id });
});

app.post("/contact/save", urlencodedParser, (req, res) => {
  let { id, avatar, name, mobile, tel, email, address } = req.body;
  let newContact = {
    id: Number(id),
    avatar,
    name,
    mobile,
    tel,
    email,
    address
  };
  data.push(newContact);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Listening on Port 3000...");
});
