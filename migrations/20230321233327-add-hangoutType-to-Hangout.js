'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hangout', 'type', {
      type: Sequelize.STRING,
      defaultValue: 'scheduled',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('hangout', 'type');
  },
};
