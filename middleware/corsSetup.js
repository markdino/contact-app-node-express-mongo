require("dotenv").config();
const cors = require("cors");

const whiteList = process.env.CORS_WHITELIST
module.exports.setup = (app) => {
  app.use(cors({
    origin: (origin, callback) => {
      whiteList.indexOf(origin) !== -1
        ? callback(null, true)
        : callback(console.error('Not allowed by CORS'))
    },
    credentials: true,
  }));
};
