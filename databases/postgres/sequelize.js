require('dotenv').config();
const Sequelize = require('sequelize');
const url = require('url');

const credentials = {
  DATABASE: process.env.DATABASE,
  USERNAME: process.env.NAME,
  PASSWORD: process.env.PASSWORD,
  HOST: process.env.HOST,
  DIALECT: 'postgres',
  PORT: process.env.DB_PORT,
  // PROD_ENV: process.env.PROD_ENV,
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
  logging: false,
};

if (process.env.PROD_ENV) {
  config.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  credentials.USERNAME = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  credentials.PASSWORD = dbUrl.auth.substr(
    dbUrl.auth.indexOf(':') + 1,
    dbUrl.auth.length
  );
  credentials.DATABASE = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
}

if (process.env.NODE_ENV == 'local') {
  console.log(
    `Setting up a local database connection: ${process.env.DATABASE_URL}`
  );
  const sequelize = new Sequelize(process.env.DATABASE_URL); // Example for postgres

  sequelize
    .authenticate()
    .then(function (err) {
      console.log(
        `DB connection has succeeded for ${process.env.DATABASE_URL}`
      );
    })
    .catch(function (err) {
      console.log(
        `Unable to connect to the database ${process.env.DATABASE_URL}`,
        err
      );
    });

  module.exports = sequelize;
} else {
  const sequelize = new Sequelize(
    credentials.DATABASE,
    credentials.USERNAME,
    credentials.PASSWORD,
    config
  );

  sequelize
    .authenticate()
    .then(function (err) {
      console.log(`DB connection has succeeded.`);
    })
    .catch(function (err) {
      console.log('Unable to connect to the database:', err);
    });

  module.exports = sequelize;
}
