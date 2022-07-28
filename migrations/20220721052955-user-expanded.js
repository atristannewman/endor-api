'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn('user','username',{type:Sequelize.STRING
      })
      await queryInterface.addColumn('user','profileImageUrl',{type:Sequelize.STRING
      })
      await queryInterface.addColumn('user','hostRating',{type:Sequelize.FLOAT
      })
  },

  async down (queryInterface, Sequelize) {
    //  await queryInterface.removeColumn('user','username');
    //  await queryInterface.removeColumn('user','profileImageUrl');
    //  await queryInterface.removeColumn('user','hostRating');  
  }
};
