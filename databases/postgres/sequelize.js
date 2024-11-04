require('dotenv').config();
const Sequelize = require('sequelize');
const envConfig = require('../../config');

// MARK: Variables
const credentials = {
  DATABASE: envConfig.db.name,
  USERNAME: envConfig.db.user,
  PASSWORD: envConfig.db.password,
  HOST: envConfig.db.host,
  DIALECT: 'postgres',
  PORT: envConfig.db.port,
  DATABASE_URL: envConfig.db.url,
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
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
};

// MARK: Helper Functions
function connect() {
  console.log(
    `Setting up a ${process.env.ENV} database connection`
  );

  const sequelize = new Sequelize(
    credentials.DATABASE,
    credentials.USERNAME,
    credentials.PASSWORD,
    config
  );

  sequelize
    .authenticate()
    .then(function (err) {
      console.log(
        `DB connection has succeeded for ${credentials.DATABASE}`
      );
    })
    .catch(function (err) {
      console.log(
        `Unable to connect to the database ${credentials.DATABASE}`,
        err
      );
    });

  module.exports = sequelize;
}

// MARK: Main
connect()
