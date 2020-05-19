const app = require("express")();
const db = require("./db/mongoose");
const middleware = require('./startups/middleware')
const passportSetup = require("./startups/passportSetup");
const routes = require("./startups/routes");
const server = require("./startups/server");

// Startups
middleware(app);
db.connect();
passportSetup(app);
routes(app);
server.start(app);
