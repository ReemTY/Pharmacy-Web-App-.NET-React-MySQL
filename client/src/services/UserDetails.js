// UserDetails.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const USER_URL = '/user'; //api url


const UserDetails = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(USER_URL);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>
      {/* You can display more user details here */}
    </div>
  );
};

export default UserDetails;
