require('dotenv').config();
const config = require('./index');

module.exports = {
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    port: config.db.port,
    host: config.db.host,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
};
