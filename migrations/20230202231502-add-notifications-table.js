'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      topic: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      deviceTokenQueue: {
        type: Sequelize.ARRAY({
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        }),
        defaultValue: []
      },
      subscriberDeviceTokens: {
        type: Sequelize.ARRAY({
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        }),
        defaultValue: []
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
  },
};
