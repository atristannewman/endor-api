'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user', {
            uuid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                primaryKey: true,
            },
            address: Sequelize.STRING,
            hasProof: Sequelize.BOOLEAN,
            hasMoonbird: Sequelize.BOOLEAN,

        }, {
            timestamps: false,
            freezeTableName: true,
        })
    },


    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("user");
    },
};
