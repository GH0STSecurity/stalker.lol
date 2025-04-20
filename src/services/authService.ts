// API base URL
const API_URL = 'http://localhost:3001/api/auth';

// Interface for API responses
interface ApiResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

// Validate token
export const validateToken = async (token: string): Promise<ApiResponse> => {
  try {
    console.log('Frontend: Validating token:', token);
    const response = await fetch(`${API_URL}/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    console.log('Frontend: Validation response:', data);
    return data;
  } catch (error) {
    console.error('Frontend: Error validating token:', error);
    return {
      success: false,
      message: 'Network error during token validation',
    };
  }
};

// Reset token
export const resetToken = async (uuid: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/reset-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uuid, password }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error resetting token:', error);
    return {
      success: false,
      message: 'Network error during token reset',
    };
  }
};

// Generate new UUID and token
export const generateUUID = async (password: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/generate-uuid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error generating UUID:', error);
    return {
      success: false,
      message: 'Network error during UUID generation',
    };
  }
};
