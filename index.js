const express = require("express");
const app = express();
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

app.listen(3000, () => {
  console.log("Listening on Port 3000...");
});
