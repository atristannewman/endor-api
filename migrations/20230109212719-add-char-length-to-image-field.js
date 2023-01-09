'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'user', 
        'profileImageUrl', 
          {
            type: Sequelize.STRING(2049),
            allowNull: true
          }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'user', 
        'profileImageUrl', 
          {
            type: Sequelize.STRING,
            allowNull: true
          }
    )
  }
};