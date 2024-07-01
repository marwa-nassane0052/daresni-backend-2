const axios = require('axios');

async function getUser(token) {
  try {
    const response = await axios.get("http://localhost:3001/auth/getInfoUser", {
      headers: {
        Authorization: token,
      },
    });

    console.log('Response from getInfoUser:', response.data); // Log the response

    if (!response.data || !response.data._id) {
      throw new Error('Invalid response format');
    }

    return response.data; // Return the entire data object
  } catch (error) {
    console.error('Error getting user ID:', error.response ? error.response.data : error.message);
    throw new Error('Unable to get user ID');
  }
}

module.exports = { getUser };
