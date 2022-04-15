require("dotenv").config();
const Sequelize = require("sequelize");

const config = {
  DB: process.env.DATABASE ? process.env.DATABASE : "GRIPH_DB",
  USERNAME: process.env.USERNAME ? process.env.USERNAME : "griph_accnt",
  PASSWORD: process.env.PASSWORD ? process.env.PASSWORD : "p@$$w0rd",
  HOST: "localhost",
  DIALECT: "postgres",
};

const sequelize = new Sequelize(config.DB, config.USERNAME, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
