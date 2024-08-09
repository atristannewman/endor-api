require('dotenv').config();
const Sequelize = require('sequelize');
const url = require('url');

// Note: Migrations v. CRUD Operations:
// * These are NOT the same credentials used to migrate dbs. Those are in config/config.js

// MARK: Variables
const credentials = {
  DATABASE: process.env.HEROKU_DB_NAME,
  USERNAME: process.env.HEROKU_DB_USER,
  PASSWORD: process.env.HEROKU_DB_PASSWORD,
  HOST: process.env.HEROKU_DB_HOST,
  DIALECT: 'postgres',
  PORT: process.env.DB_PORT,
  DATABASE_URL: process.env.HEROKU_DB_URI,
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
function connectToLocal() {
  console.log(
    `Setting up a local database connection`
  );

  const postgresDbUrl = `postgres://${process.env.AWS_RDS_USERNAME}:${process.env.AWS_RDS_PASSWORD}@localhost:${process.env.DB_PORT}/${process.env.AWS_RDS_DBNAME}`
  const sequelize = new Sequelize(postgresDbUrl); // Example for postgres

  sequelize
    .authenticate()
    .then(function (err) {
      console.log(
        `DB connection has succeeded for ${postgresDbUrl}`
      );
    })
    .catch(function (err) {
      console.log(
        `Unable to connect to the database ${postgresDbUrl}`,
        err
      );
    });

  module.exports = sequelize;
}

function connectToDevelopment() {
  console.log(
    `Setting up a development database connection`
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
      `DB connection has succeeded for ${process.env.HEROKU_DB_NAME}`
    })
    .catch(function (err) {
      console.log(`Unable to connect to the database ${process.env.HEROKU_DB_NAME}:`, err);
    });

  module.exports = sequelize;
}

// TODO: Convert Production db to Heroku Postgres add-on
function connectToProduction() {
  console.log(
    `Setting up a production database connection`
  );

  config.dialectOptions = {
    ssl: {
      require: false,
      rejectUnauthorized: false,
    },
  };

  const { AWS_RDS_ENDPOINT, AWS_RDS_USERNAME, AWS_RDS_PASSWORD } = process.env;
  const dbUrl = url.parse(AWS_RDS_ENDPOINT);

  credentials.USERNAME = AWS_RDS_USERNAME
  credentials.PASSWORD = AWS_RDS_PASSWORD
  
  credentials.DATABASE = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
}

// MARK: Main
const environment = process.env.ENV
switch (environment) {
  case 'production':
    connectToProduction()
    break;
  case 'development':
    connectToDevelopment()
    break;
  default:
    connectToLocal()
    break
}
