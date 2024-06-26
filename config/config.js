require('dotenv').config();

module.exports = {
    username: process.env.HEROKU_DB_USER,
    password: process.env.HEROKU_DB_PASSWORD,
    database: process.env.HEROKU_DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.HEROKU_DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
};
