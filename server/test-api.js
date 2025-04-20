const fetch = require('node-fetch');

const testApi = async () => {
  try {
    const testToken = 'dab925b6c6dc262398958430f2cbea707395b422845bd442dbf7858156f5cba0';
    console.log(`Testing API validation for token: ${testToken}`);
    
    const response = await fetch('http://localhost:3001/api/auth/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: testToken }),
    });
    
    const data = await response.json();
    console.log('API Response:', data);
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
};

testApi();
