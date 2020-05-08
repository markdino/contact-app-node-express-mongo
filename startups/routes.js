const public = require("../routes/public");
const contact = require("../routes/contact");
const user = require("../routes/user");
const pageNotFound = require("../routes/404");

module.exports = (app) => {
  app.use("/", public);
  app.use("/contact", contact);
  app.use("/user", user);
  app.use(pageNotFound);
};
