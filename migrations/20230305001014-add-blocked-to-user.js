'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'blockedUserIds',{
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'blockedUserIds');
  },
};