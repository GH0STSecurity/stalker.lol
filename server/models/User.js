const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.passwordHash) {
        const saltRounds = 10;
        user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('passwordHash')) {
        const saltRounds = 10;
        user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
      }
    }
  }
});

// Instance method to check password
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

module.exports = User;
