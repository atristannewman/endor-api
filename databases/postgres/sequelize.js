require("dotenv").config();
const Sequelize = require("sequelize");

const credentials = {
  DATABASE: process.env.DATABASE ? process.env.DATABASE : "GRIPH_DB",
  USERNAME: process.env.NAME ? process.env.NAME : "griph_accnt",
  PASSWORD: process.env.PASSWORD ? process.env.PASSWORD : "p@$$w0rd",
  HOST: process.env.HOST,
  DIALECT: "postgres",
  PORT: process.env.PORT,
  //PROD_ENV: process.env.PROD_ENV,
  DATABASE_URL: process.env.DATABASE_URL,

};

let config = {
  host: credentials.HOST,
  dialect: credentials.DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// if (process.env.PROD_ENV) {
  config.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
// }

const sequelize = new Sequelize(
  credentials.DATABASE,
  credentials.USERNAME,
  credentials.PASSWORD,
  config
);

module.exports = sequelize;
