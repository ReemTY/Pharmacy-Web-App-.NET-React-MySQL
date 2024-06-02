import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', categoryId: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5268/api/medicine`);
      setMedicines(response.data);
    } catch (error) {
      setErrorMessage('Error fetching medicines. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setFormData({ name: '', description: '', price: '', categoryId: '' });
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  const handleAddMedicine = async () => {
    try {
      if (!formData.name || !formData.description || !formData.price || !formData.categoryId) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }

      if (isNaN(formData.price) || formData.price < 0) {
        setErrorMessage('Please enter a valid price.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(`http://localhost:5268/api/Medicine`, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          categoryId: formData.categoryId
        });

        if (response.status === 201) {
          setSuccessMessage('Medicine added successfully!');
          fetchMedicines();
        } else {
          setErrorMessage('An error occurred while adding medicine. Please try again.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while communicating with the server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  const handleDeleteMedicine = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5268/api/Medicine/${id}`);
      if (response.status === 200) {
        setSuccessMessage('Medicine deleted successfully!');
        fetchMedicines();
      } else {
        setErrorMessage('An error occurred while deleting medicine. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while communicating with the server. Please try again later.');
    }
  };

  const handleUpdateMedicine = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5268/api/Medicine/${id}`, updatedData);
      if (response.status === 200) {
        setSuccessMessage('Medicine updated successfully!');
        fetchMedicines();
      } else {
        setErrorMessage('An error occurred while updating medicine. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while communicating with the server. Please try again later.');
    }
  };

  return (
    <Container>
      <Button color="primary" onClick={toggleModal}>Add Medicine</Button>
      {isLoading && <p>Loading...</p>}
      {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Medicine</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name*</Label>
              <Input type="text" name="name" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description*</Label>
              <Input type="text" name="description" id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price*</Label>
              <Input type="number" name="price" id="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label for="categoryId">Category*</Label>
              <Input type="select" name="categoryId" id="categoryId" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                <option value="">Select category</option>
                {/* Render options dynamically based on fetched categories */}
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddMedicine}>Add</Button>{' '}
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Row>
        {medicines.map((medicine) => (
          <Col key={medicine.id} sm="6" md="4" lg="3">
            <Card>
              <CardBody>
                <h5>{medicine.name}</h5>
                <p>{medicine.description}</p>
                <p>${medicine.price}</p>
                <Button color="danger" onClick={() => handleDeleteMedicine(medicine.id)}>Delete</Button>
                <Button color="info" onClick={() => handleUpdateMedicine(medicine.id, { name: 'Updated Name', description: 'Updated Description', price: 10 })}>Update</Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;
