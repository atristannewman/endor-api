const Sequelize = require('sequelize');
const db = require('../../databases/postgres/sequelize');

const CustomerData = db.define('customerData', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  data: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
}, {
  timestamps: true,
  freezeTableName: true,
});
const findByEmail = async (email) => {
  return await CustomerData.findOne({ where: { email } });
};

const create = async (email, data) => {
  try {
    const customerData = await CustomerData.create({ 
        email,
        data
    });
    return customerData; // Return the created customer data object
  } catch (error) {
    console.error('Error creating customer data:', error);
    throw error;
  }
};

  const update = async (email, data) => {
    try {
      const rowsUpdated = await CustomerData.update(
        { data },
        { where: { email } }
      );

      if(rowsUpdated[0] === 1) {
        const returnedCustomerData = await findByEmail(email);

        if (returnedCustomerData.data === data){
          return returnedCustomerData.data
        }
      }
    } catch (error) {
      console.error('Error updating customer data:', error);
      throw error;
    }
  };


const destroy = async (email) => {
  return await CustomerData.destroy({ where: { email } });
};

module.exports = {
    CustomerData,
    create,
    findByEmail,
    update,
    destroy
}