'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn("user", "NFTs", {
      type: Sequelize.JSON,
            allowNull: true,
            defaultValue: {
              logoUrl: DataTypes.STRING,
              ethFloorPrice: DataTypes.DOUBLE,
              name: DataTypes.STRING,
              contractAddress: DataTypes.STRING
            }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "NFTs");
  }
};
