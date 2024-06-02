import axios from 'axios';

// Function to make API call to login endpoint
const loginApi = async (Email, Password) => {
  try {
    // Make POST request to login endpoint with username and password
    const response = await axios.post('http://localhost:5268/api/user/login', {
        Email,
      Password
    });
    return response.data; // Return response data (including token)
  } catch (error) {
    throw error; // Throw error if login fails
  }
};

export default loginApi;
