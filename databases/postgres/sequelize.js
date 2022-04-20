require("dotenv").config();
const Sequelize = require("sequelize");

const credentials = {
  DB: process.env.DATABASE ? process.env.DATABASE : "GRIPH_DB",
  USERNAME: process.env.USERNAME ? process.env.USERNAME : "griph_accnt",
  PASSWORD: process.env.PASSWORD ? process.env.PASSWORD : "p@$$w0rd",
  HOST: process.env.HOST,
  DIALECT: "postgres",
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

if (process.env.PROD_ENV) {
  config.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = new Sequelize(
  credentials.DB,
  credentials.USERNAME,
  credentials.PASSWORD,
  config
);

module.exports = sequelize;
