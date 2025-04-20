const { User, Token } = require('./models');

const testToken = async () => {
  try {
    console.log('Creating test user and token...');
    
    // Create a test user
    const user = await User.create({
      passwordHash: 'TestPassword123',
      isAdmin: false
    });
    
    console.log(`Test user created with UUID: ${user.uuid}`);
    
    // Generate token for the user
    const token = await Token.createForUser(user.uuid);
    
    console.log(`Test token generated: ${token.token}`);
    console.log(`Use this token to test the login functionality.`);
    console.log(`UUID: ${user.uuid}`);
    console.log(`Password: TestPassword123`);
    
  } catch (error) {
    console.error('Error creating test user and token:', error);
  }
};

testToken();
