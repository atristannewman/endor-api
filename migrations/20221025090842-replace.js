'use strict';

//REPLACES WALLET ADDRESS COL WITH ADDRESSES
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "address");

    await queryInterface.addColumn("user", "walletAddresses", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: null,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "walletAddresses");

    await queryInterface.addColumn("user", "address", {
      type: Sequelize.STRING
    });
  }
};
