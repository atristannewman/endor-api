'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "location", {
      type: Sequelize.JSONB,
      defaultValue: {
        latitude: 0,
        longitude: 0,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "location");
  }
};
