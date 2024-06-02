import React, { useState } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import UserDetails from './UserDetails';

const UsersPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <div>
      <h1></h1>
      <div>
        <UserList onSelectUser={handleUserSelect} />
      </div>
      <div>
        <UserForm userId={selectedUserId} />
      </div>
      <div>
        {selectedUserId && <UserDetails userId={selectedUserId} />}
      </div>
    </div>
  );
};

export default UsersPage;
