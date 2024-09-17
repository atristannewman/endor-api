/* eslint-disable no-useless-catch */
const Sequelize = require('sequelize');
const db = require('../sequelize');
const makeMagicLink = require('../../../models/magicLink');

// const User = db.define(
//     'user',
//     {
//       uuid: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV1,
//         primaryKey: true,
//       },

const MagicLink = db.define(
    'magicLink', 
    {
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
        },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
);

const create = async (args) => {

    try {
        return await MagicLink.create({
            email: args.email,
            token: args.token,
            expires_at: args.expires_at,
        });
    } catch (error) {
        console.error('Error creating MagicLink:', error);
        throw error;
    }
};

// TODO: Everything below

const findByToken = async (token) => {
    try {
        return await MagicLink.findOne({
        where: {
            token,
        },
        });
    } catch (error) {
        console.error('Error finding MagicLink by token:', error);
        throw error;
    }
};

const deleteById = async (id) => {
    try {
        return await MagicLink.destroy({
        where: {
            id,
        },
        });
    } catch (error) {
        console.error('Error deleting MagicLink by id:', error);
        throw error;
    }
};

module.exports = Object.freeze({
    MagicLink,
    create,
    deleteById,
    findByToken,
});