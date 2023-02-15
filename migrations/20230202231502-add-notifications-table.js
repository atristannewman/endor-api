'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeTable('notifications', {
      topic: {
        type: Sequelize.STRING,
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
      },
      topicId: {
        type: Sequelize.STRING,
        defaultValue: null,
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
  },
};
