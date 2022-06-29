"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.renameColumn("user", "address", "addressNew");
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.renameColumn("user", "addressNew", "address");
  },
};
