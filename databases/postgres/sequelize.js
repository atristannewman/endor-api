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
  DATABASE_URL: 'localhost',
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

if (process.env.ENV === 'production') {
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

if (process.env.ENV == 'local') {
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
