'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.renameColumn('hangout', 'user_id', 'userId');
  },

  async down(queryInterface, Sequelize) {
    queryInterface.renameColumn('hangout', 'userId', 'user_id');
  },
};
