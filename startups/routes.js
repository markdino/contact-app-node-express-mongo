const public = require("../routes/public");
const contact = require("../routes/contact");
const user = require("../routes/user");
const publicApi = require('../routes/api/public');
const contactApi = require('../routes/api/contact');
const userApi = require('../routes/api/user');
const notFoundApi = require("../routes/api/404");
const pageNotFound = require("../routes/404");

module.exports = (app) => {
  app.use("/", public);
  app.use("/contact", contact);
  app.use("/user", user);
  app.use('/api', publicApi);
  app.use('/api/contact', contactApi);
  app.use('/api/user', userApi);
  app.use('/api/', notFoundApi);
  app.use(pageNotFound);
};
