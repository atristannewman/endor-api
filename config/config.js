require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    dialectOptions: {
      require: false,
      ssl: false
    }
  }
};

// require('dotenv').config(); // this is important!
// module.exports = {
//   local: {
//     username: process.env.USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
//   },
//   development: {
//     username: process.env.USERNAME,
//     password: process.env.PASSWORD,
//     database: process.DATABASE,
//     host: process.env.HOST,
//     dialect: 'postgres',
//   },
//   test: {
//     username: process.env.USERNAME,
//     password: process.env.PASSWORD,
//     database: process.DATABASE,
//     host: process.env.HOST,
//     dialect: 'postgres',
//   },
//   production: {
//     use_env_variable: 'DATABASE_URL',
//     dialect: 'postgres',
//     protocol: 'postgres',
//     ssl: true,
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//   },
// };
