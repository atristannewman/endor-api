'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hangout', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      address: Sequelize.STRING,
      startTime: Sequelize.STRING,
      endTime: Sequelize.STRING,
      tags: Sequelize.ARRAY(Sequelize.STRING)
    },
      {
        timestamps: false,
        freezeTableName: true,
      })
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("hangout");
  },
};
