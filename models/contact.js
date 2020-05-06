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

module.exports.search = (result, req, res, options) => {
  const searched = result.filter(person => {
    const personLC = person.name.toLowerCase();
    const searchLC = req.body.search.toLowerCase();
    return personLC.includes(searchLC);
  });
  if (req.body.search === "") {
    return res.redirect(options.emptyRedirect);
  } else {
    return res.render(options.render, {
      data: searched,
      user: req.user,
      status: options.status
    });
  }
};

module.exports.errorAlert = (code, status, message) => {
  return { Error: { code, status, message } };
};
