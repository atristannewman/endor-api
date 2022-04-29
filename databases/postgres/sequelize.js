require("dotenv").config();
const Sequelize = require("sequelize");

const credentials = {
  DATABASE: process.env.DATABASE,
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,
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
