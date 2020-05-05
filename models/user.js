const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, require: [true, "Username field is reuired"] },
  password: { type: String, require: [true, "Password field is reuired"] },
  isAdmin: Boolean
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);
