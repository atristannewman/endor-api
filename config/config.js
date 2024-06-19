require('dotenv').config();

module.exports = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.AWS_RDS_DBNAME,
    port: process.env.DB_PORT,
    host: process.env.LOCAL_DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      require: false,
      ssl: false
    }
};
