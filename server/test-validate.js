const { User, Token } = require('./models');

const testValidate = async () => {
  try {
    const testToken = 'dab925b6c6dc262398958430f2cbea707395b422845bd442dbf7858156f5cba0';
    console.log(`Testing token validation for: ${testToken}`);
    
    // Find the token in the database
    const tokenRecord = await Token.findOne({
      where: {
        token: testToken,
        isRevoked: false
      },
      include: [{ model: User, as: 'user' }]
    });
    
    if (!tokenRecord) {
      console.log('Token not found or expired');
      return;
    }
    
    console.log('Token found:', tokenRecord.token);
    console.log('User UUID:', tokenRecord.user.uuid);
    console.log('Is Admin:', tokenRecord.user.isAdmin);
    console.log('Token expires at:', tokenRecord.expiresAt);
    
  } catch (error) {
    console.error('Error validating token:', error);
  }
};

testValidate();
