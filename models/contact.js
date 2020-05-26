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

module.exports.search = (result, query, req, res, options) => {
  let searched = result.filter(person => {
    const personLC = person.name.toLowerCase();
    const searchLC = query.toLowerCase();
    return personLC.includes(searchLC);
  });
  if (searched.length <= 0) searched = `No contact matched for "${query}"`;

  if (!req) { return searched }
  else {
    if (query === "") {
      return res.redirect(options.emptyRedirect);
    } else {
      return res.render(options.render, {
        data: searched,
        user: req.user,
        status: options.status
      });
    }
  }

};

module.exports.errorAlert = (code, status, message) => {
  return { Error: { code, status, message } };
};

module.exports.payload = (error, value, name) => {
  return { error, value, name };
};

module.exports.filter = (obj, query) => {
  const q = query.split(" ");
  const newObj = {};

  q.forEach(que => {
    if (obj[que] || obj[que] === false) newObj[que] = obj[que];
  })

  return newObj
}