require("dotenv").config();
const Sequelize = require("sequelize");

const credentials = {
  DATABASE: process.env.DATABASE,
  USERNAME: process.env.NAME,
  PASSWORD: process.env.PASSWORD,
  HOST: process.env.HOST,
  DIALECT: "postgres",
  PORT: process.env.DB_PORT,
  // PROD_ENV: process.env.PROD_ENV,
  // DATABASE_URL: process.env.DATABASE_URL,
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
  logging:false
};

if (process.env.PROD_ENV) {
  config.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = new Sequelize(
  credentials.DATABASE,
  credentials.USERNAME,
  credentials.PASSWORD,
  config
);

// sequelize.sync({force:true}).then(() => console.log("synced"));

sequelize
  .authenticate()
  .then(function (err) {
    console.log("Connection has been established successfully.");
    // sequelize.sync({ force: true }).then(() => console.log("synced"));
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

  // const db={};
  // db.Sequelize=Sequelize;
  // db.sequelize=sequelize;
  
  // db.users=require("./entity/user")
  // db.hangouts=require("./entity/hangout")
  
  // db.users.hasMany(db.hangouts,{foreignkey:'hosts',as:"hosts"});
  // db.hangouts.belongsTo(db.users,{foreignkey:'hosts'});


module.exports = sequelize;