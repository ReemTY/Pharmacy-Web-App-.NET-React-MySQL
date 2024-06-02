import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5268/api/admin/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axios.put(`http://localhost:5268/api/admin/requests/${requestId}/approve`);
      // Update the status of the request locally or fetch the updated list of requests
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.put(`http://localhost:5268/api/admin/requests/${requestId}/decline`);
      // Update the status of the request locally or fetch the updated list of requests
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Medicine</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.userId}</td>
              <td>{request.medicine}</td>
              <td>{request.status}</td>
              <td>
                <button onClick={() => handleApprove(request.id)}>Approve</button>
                <button onClick={() => handleDecline(request.id)}>Decline</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
