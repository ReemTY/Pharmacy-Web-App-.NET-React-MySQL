import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table } from 'reactstrap';
import axios from '../../api/axios';

function Starter() {
  // State variables
  const [requestedMedicines, setRequestedMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch requested medicines data
  useEffect(() => {
    fetchRequestedMedicines();
  }, []);

  const fetchRequestedMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get('admin/requested-medicines');
      setRequestedMedicines(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requested medicines:', error);
      setMessage('Failed to fetch requested medicines. Please try again.');
      setLoading(false);
    }
  };

  // Function to handle accepting a requested medicine
  const handleAccept = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`admin/requested-medicines/approve${id}`);
      setMessage(response.data.message); 
      setLoading(false);
      // Remove the medicine from the list after accepting
      setRequestedMedicines(requestedMedicines.filter(medicine => medicine.id !== id));
    } catch (error) {
      console.error('Error accepting medicine:', error);
      setMessage('Failed to accept medicine. Please try again.');
      setLoading(false);
    }
  };

  // Function to handle declining a requested medicine
  const handleDecline = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(`admin/requested-medicines/decline${id}`);
      setMessage(response.data.message); 
      setLoading(false);
      // Remove the medicine from the list after declining
      setRequestedMedicines(requestedMedicines.filter(medicine => medicine.id !== id));
    } catch (error) {
      console.error('Error declining medicine:', error);
      setMessage('Failed to decline medicine. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Requested Medicines</h1>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requestedMedicines.map((medicine, index) => (
                <tr key={index}>
                  <td>{medicine.name}</td>
                  <td>{medicine.description}</td>
                  <td>
                    <Button color="success" onClick={() => handleAccept(medicine.id)}>Accept</Button>{' '}
                    <Button color="danger" onClick={() => handleDecline(medicine.id)}>Decline</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Starter;
