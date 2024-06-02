// UserListItem.js
import React from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';

const UserListItem = ({ user }) => {
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5268/api/admin/${user.id}`);
      // Optionally, you can update the user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <Button color="danger" onClick={handleDeleteUser}>Delete</Button>
    </div>
  );
};

export default UserListItem;
