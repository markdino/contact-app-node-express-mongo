const mongoose = require("mongoose");

module.exports = {
  connect() {
    mongoose.connect("mongodb://localhost/contact", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
};
