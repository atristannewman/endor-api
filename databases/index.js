const postgres = require("./postgres");
const {User} = require("./postgres/entity/user");
const {Hangout} = require("./postgres/entity/hangout");
const DB_DIALECT = {
  postgres: "postgres",
  mysql: "mysql",
};
// const db = require("./postgres/sequelize");

module.exports = ({ db, isMock }) => {
  let selectedDB = null;

  switch (db) {
    case DB_DIALECT.postgres: {
      selectedDB = isMock ? postgres.mockDB : postgres.DB;

      break;
    }
    default: {
      selectedDB = isMock ? postgres.mockDB : postgres.DB;
      break;
    }
  }

  const User = selectedDB.User.User;
  const Vendor = selectedDB.Vendor.Vendor;
  const Hangout=selectedDB.Hangout.Hangout;

  return selectedDB;
};
