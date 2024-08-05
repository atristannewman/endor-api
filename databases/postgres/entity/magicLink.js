const Sequelize = require('sequelize');
const db = require('../sequelize');

const MagicLink = db.define('MagicLink', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
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
}, {
    tableName: 'MagicLinks',
  timestamps: true,
});

const create = async (args) => {
    try {
        console.log('MagicLink.create:', JSON.stringify(args));
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