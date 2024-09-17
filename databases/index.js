const postgres = require("./postgres");
const {User} = require("./postgres/entity/user");
const {Hangout} = require("./postgres/entity/hangout");
const {TokenproofAddress} = require("./postgres/entity/tokenproofAddress");
const {Notification} = require("./postgres/entity/notification");
const {MagicLink} = require("./postgres/entity/magicLink");
// const {CustomerId} = require("./postgres/entity/customerId");
// const {ApiKey} = require("./postgres/entity/apiKey");

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
  const Hangout = selectedDB.Hangout.Hangout;
  const TokenproofAddress = selectedDB.TokenproofAddress.TokenproofAddress;
  const Notification = selectedDB.Notification.Notification;
  const MagicLink = selectedDB.MagicLink.MagicLink;
  const CustomerId = selectedDB.CustomerId.CustomerId;
  const ApiKey = selectedDB.ApiKey.ApiKey;

  return selectedDB;
};
