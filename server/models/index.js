const User = require('./User');
const Token = require('./Token');

// Define relationships
User.hasMany(Token, {
  foreignKey: 'userUuid',
  as: 'tokens',
  onDelete: 'CASCADE'
});

Token.belongsTo(User, {
  foreignKey: 'userUuid',
  as: 'user'
});

module.exports = {
  User,
  Token
};
