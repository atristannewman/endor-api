"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.removeColumn("user", "newColumn");
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.addColumn("user", "newColumn", Sequelize.STRING);
  },
};
