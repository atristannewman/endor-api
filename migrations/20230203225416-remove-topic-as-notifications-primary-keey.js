'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('notifications', 'topic',{
      type: Sequelize.STRING,
      unique: false,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('notifications', 'topic',{
      type: Sequelize.STRING,
      primaryKey: true,
      unique: false,
      allowNull: false
    });
  },
};
