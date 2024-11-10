"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "notificationPreferences", {
      type: Sequelize.JSONB,
      defaultValue: {
        minPossibleAttendees: 0,
        distanceFromPossibleAttendees: 0,
        location: "",
        minHostRating: 5,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "notificationPreferences");
  },
};
