const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  owner: { type: String, require: [true, "Authenticated user is reuired"] },
  avatar: String,
  name: { type: String, require: [true, "Name field is reuired"] },
  mobile: String,
  tel: String,
  email: String,
  address: String,
  private: Boolean
});

module.exports = mongoose.model("contact", personSchema);
