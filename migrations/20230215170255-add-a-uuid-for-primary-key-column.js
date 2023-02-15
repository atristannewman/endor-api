'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("notifications", "uuid", {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("notifications", "uuid");

  }
};
