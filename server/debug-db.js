const { User, Token } = require('./models');

const debugDatabase = async () => {
  try {
    console.log('Debugging database...');
    
    // Get all users
    const users = await User.findAll();
    console.log('Users in database:', users.length);
    users.forEach(user => {
      console.log(`User UUID: ${user.uuid}, isAdmin: ${user.isAdmin}, createdAt: ${user.createdAt}`);
    });
    
    // Get all tokens
    const tokens = await Token.findAll({ include: [{ model: User, as: 'user' }] });
    console.log('Tokens in database:', tokens.length);
    tokens.forEach(token => {
      console.log(`Token: ${token.token}, userUuid: ${token.userUuid}, isRevoked: ${token.isRevoked}, expiresAt: ${token.expiresAt}`);
    });
    
    console.log('Database debugging complete.');
  } catch (error) {
    console.error('Error debugging database:', error);
  }
};

debugDatabase();
