'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'hangout', // name of Source model
      'user_id', // name of the key we're adding 
      {
        type: Sequelize.UUID,
        references: {
          model: 'user', // name of Target model
          key: 'uuid', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'hangout', // name of Source model
      'user_id',
    );
  }
};
