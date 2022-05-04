const postgres = require("./postgres");
const DB_DIALECT = {
  postgres: "postgres",
  mysql: "mysql",
};

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

  return selectedDB;
};
