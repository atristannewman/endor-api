'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokenproofAddresses', {
      nonce: Sequelize.STRING,
      walletAddress: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tokenproofAddresses");
  },
};