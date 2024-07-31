// config.js
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  APP_NAME: process.env.APP_NAME,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  // Database Connection
  DB: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    operatorsAliases: 0,
  },
  MONGO_DB: process.env.MONGO_DB,
  SESSION_SECRET: process.env.SESSION_SECRET,
  TWILIO: {
    ACCOUNT_SID: process.env.ACCOUNT_SID,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    VERIFY_SERVICE_SID: process.env.VERIFY_SERVICE_SID
  }
};
