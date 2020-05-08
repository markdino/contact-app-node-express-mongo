require("dotenv").config();
const mongoose = require("mongoose");

module.exports = {
  connect() {
    mongoose.connect(process.env.DB_PATH, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
};
