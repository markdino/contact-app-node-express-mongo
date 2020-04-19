const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/contact", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const personSchema = new mongoose.Schema({
  avatar: String,
  name: { type: String, require: [true, "Name field is reuired"] },
  mobile: String,
  tel: String,
  email: String,
  address: String
});

module.exports = mongoose.model("contact", personSchema);
