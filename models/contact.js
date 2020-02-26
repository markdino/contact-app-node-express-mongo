const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/contact", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const personSchema = new mongoose.Schema({
  avatar: String,
  name: String,
  mobile: String,
  tel: String,
  email: String,
  address: String
});

module.exports = mongoose.model("contact", personSchema);
