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

  const MagicLink = selectedDB.MagicLink.MagicLink;
  const CustomerId = selectedDB.CustomerId.CustomerId;
  const ApiKey = selectedDB.ApiKey.ApiKey;

  return selectedDB;
};
