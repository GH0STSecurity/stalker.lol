const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const crypto = require('crypto');

const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  userUuid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'uuid'
    }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['token']
    },
    {
      fields: ['userUuid']
    }
  ]
});

// Static method to generate a secure token
Token.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Static method to create a token for a user
Token.createForUser = async function(userUuid, expiresInDays = 30) {
  // Revoke any existing tokens for this user
  await this.update(
    { isRevoked: true },
    { where: { userUuid, isRevoked: false } }
  );
  
  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  
  // Create a new token
  return await this.create({
    userUuid,
    token: this.generateToken(),
    expiresAt
  });
};

module.exports = Token;
