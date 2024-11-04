'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('magicLink', {
      uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV1,
          primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }

  }, {
      timestamps: true,
      freezeTableName: true,
  })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("magicLink");
  }
};
