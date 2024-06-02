import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from '../api/axios';

const USER_URL = '/admin/${userId}'; //api url


const UserForm = ({ userId }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(USER_URL);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5268/api/admin/${userId}`, formData);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5268/api/admin/${userId}`);
        alert('User deleted successfully!');
        setUser(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5268/api/admin/signup', formData);
      alert('User created successfully!');
      setFormData({ username: '', email: '', passwordHash: '' });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div>
      <h2>{userId ? 'Edit User' : 'Create User'}</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input type="text" name="username" id="username" value={formData.username} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="passwordHash">Password</Label>
          <Input type="password" name="passwordHash" id="passwordHash" value={formData.passwordHash} onChange={handleChange} />
        </FormGroup>
        <Button color="primary" type="submit">{userId ? 'Update' : 'Create'}</Button>
      </Form>

      {userId && (
        <div>
          <h2>Delete User</h2>
          <Button color="danger" onClick={handleDelete}>Delete</Button>
        </div>
      )}

      {userId && user && (
        <div>
          <h2>User Details</h2>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserForm;
