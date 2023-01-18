'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn("user", "NFTs", {
      type: Sequelize.JSON,
            allowNull: true,
            defaultValue: {
              logoUrl: Sequelize.STRING,
              ethFloorPrice: Sequelize.DOUBLE,
              name: Sequelize.STRING,
              contractAddress: Sequelize.STRING
            }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "NFTs");
  }
};
