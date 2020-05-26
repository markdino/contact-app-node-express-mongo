const { payload } = require('../models/contact')
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).send(payload('Unauthorized user.', null, 'Unauthorized'));
};
