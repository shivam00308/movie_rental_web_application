const winston = require("winston");
const express = require('express');
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

// const p = Promise.reject(new Error("failed"));
// p.then(() => {console.log("done")});
// throw new Error("something failed during startup");

const port = process.env.MONGODB_URI || 3000;
let server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;