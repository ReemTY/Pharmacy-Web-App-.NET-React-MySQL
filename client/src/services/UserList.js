import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap'; // Assuming you're using Bootstrap for styling
import axios from '../api/axios';

const USER_URL = '/user'; //api url
const DEL_USER_URL = '/admin/${userId}'; // This should be for deleting, not updating

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [updatedUsername, setUpdatedUsername] = useState(''); // Changed variable name to updatedUsername
  const [updatedEmail, setUpdatedEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(USER_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const updateUser = async () => {
    try {
      // Implement the logic to update user data
      // Get the updated username and email from the state
      const updatedUser = {
        username: updatedUsername, // Changed variable name to updatedUsername
        email: updatedEmail,
      };
      await axios.put(`/admin/${selectedUserId}`, updatedUser);

      // Refresh the user list after updating
      fetchUsers();
      toggleModal(); // Close the modal after updating
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const openUpdateModal = (userId) => {
    setSelectedUserId(userId);
    setModal(true);
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/admin/${userId}`);
      // Refresh the user list after deletion
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>User List</h1>
      <Table bordered hover striped style={{ backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td> {/* Changed variable name to username */}
              <td>{user.email}</td>
              <td>
                <Button color="danger" onClick={() => deleteUser(user.id)}>Delete</Button>{' '}
                <Button color="primary" onClick={() => openUpdateModal(user.id)}>Update</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for updating user */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Update User</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="updatedUsername">Username</Label> {/* Changed variable name to updatedUsername */}
              <Input type="text" name="updatedUsername" id="updatedUsername" value={updatedUsername} onChange={(e) => setUpdatedUsername(e.target.value)} /> {/* Changed variable name to updatedUsername */}
            </FormGroup>
            <FormGroup>
              <Label for="updatedEmail">Email</Label>
              <Input type="email" name="updatedEmail" id="updatedEmail" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={updateUser}>Update</Button>{' '}
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserList;
