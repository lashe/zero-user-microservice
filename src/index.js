const app = require("./app");
const Logger = require("./utils/logger");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");

const { PORT } = require("./config");
const { MONGO_DB } = require("./config/app");

mongoose.connect(
  `${MONGO_DB}`
);

// Creating object of key and certificate
// for SSL
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// Creating https server by passing
// options and app object
// const server = https.createServer(options, app).listen(PORT, function () {
//   Logger.info(`app running on ${PORT}`);
// });

const server =  app.listen(PORT, function () {
  Logger.info(`app running on ${PORT}`);
});

process.on("uncaughtException", (err) => {
  Logger.warn("Uncaught Exception!! Shutting down process..");
  Logger.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  Logger.warn("Unhandled Rejection!!" + err);
  // process.exit(1);
});

module.exports = server;
