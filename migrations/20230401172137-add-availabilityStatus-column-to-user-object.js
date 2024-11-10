'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'availabilityStatus', {
      type: Sequelize.STRING,
      defaultValue: 'unavailable',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'availabilityStatus');
  },
};
