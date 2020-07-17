const app = require("express")();
const db = require("./db/mongoose");
const middleware = require('./startups/middleware')
const routes = require("./startups/routes");
const server = require("./startups/server");

db.connect();

// Startups
middleware(app);
routes(app);
server.start(app);
