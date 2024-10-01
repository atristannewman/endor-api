const Sequelize = require('sequelize');
const db = require('../../databases/postgres/sequelize');

const Context = db.define('customerContexts', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  context: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
}, {
  timestamps: true,
  freezeTableName: true,
});
const findByEmail = async (email) => {
  return await Context.findOne({ where: { email } });
};

const create = async (email, context) => {
  try {
    return await Context.create({ 
        email,
        context
    });
  } catch (error) {
    console.error('Error creating customer context:', error);
    throw error;
  }
};

    // Start Generation Here
    const update = async (email, context) => {
      try {
        const [updatedRows] = await Context.update(
          { context },
          { where: { email } }
        );

        return updatedRows === 1;
      } catch (error) {
        console.error('Error updating customer context:', error);
        throw error;
      }
    };


const destroy = async (email) => {
  return await Context.destroy({ where: { email } });
};

module.exports = {
    Context,
    create,
    findByEmail,
    update,
    destroy
}