import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert, Spinner, Table } from 'reactstrap';
import axios from '../api/axios';
import FullLayout from '../layouts/FullLayout';

const CAT_URL = '/category'; //api url

function Categories () {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
const [formData, setFormData] = useState({
  name: '',
  description: '',
  medicines: [
    {
      name: '', // Provide a default value or leave it empty if appropriate
      description: '',
      price: 0
    }
  ]
});

  
  const [modal, setModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    return () => {
      // Cleanup function to cancel ongoing requests
      // You need to implement axios cancellation logic
    };
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(CAT_URL);
      setCategories(response.data);
    } catch (error) {
      setError('Error fetching categories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async () => {
    try {
      await axios.post(CAT_URL, formData);
      setModal(false);
      fetchCategories(); // Refresh categories after creation
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Error creating category. Please try again.');
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:5268/api/category/${categoryId}`);
      fetchCategories(); // Refresh categories after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Error deleting category. Please try again.');
    }
  };

  const updateCategory = async () => {
    try {
      await axios.put(`http://localhost:5268/api/category/${selectedCategory.id}`, formData);
      setModal(false);
      fetchCategories(); // Refresh categories after update
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Error updating category. Please try again.');
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    setSelectedCategory(null);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'description') {
      setFormData({ ...formData, [name]: value });
    } else {
      const newMedicines = [...formData.medicines];
      newMedicines[index] = { ...newMedicines[index], [name]: value }; // Update the medicine's field
      setFormData((prevState) => ({
        ...prevState,
        medicines: newMedicines
      }));
    }
  };
  
  
  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: '', description: '', price: 0 }
      ]
    });
  };

  const removeMedicine = (index) => {
    const newMedicines = [...formData.medicines];
    newMedicines.splice(index, 1);
    setFormData({ ...formData, medicines: newMedicines });
  };

  const editCategory = (category) => {
    setFormData(category);
    setSelectedCategory(category);
    setModal(true);
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1>Categories</h1>
            <Button color="primary" onClick={toggleModal} style={{ marginBottom: '20px' }}>+</Button>
            {isLoading && <Spinner color="primary" />}
            {error && (
              <Alert color="danger">
                {error} <Button color="link" onClick={fetchCategories}>Retry</Button>
              </Alert>
            )}
            {!isLoading && !error && (
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <Button color="danger" onClick={() => deleteCategory(category.id)}>Delete</Button>{' '}
                        <Button color="primary" onClick={() => editCategory(category)}>Update</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add/Edit Category</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" name="name" id="name" value={formData.name} onChange={(e) => handleInputChange(e)} style={{ marginBottom: '10px' }} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="text" name="description" id="description" value={formData.description} onChange={(e) => handleInputChange(e)} style={{ marginBottom: '10px' }} />
            </FormGroup>
            <FormGroup>
              <Label>Medicines</Label>
              {formData.medicines.map((medicine, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <FormGroup>
                    <Label for={`medicineName${index}`}>Medicine Name</Label>
                    <Input type="text" name={`medicineName${index}`} id={`medicineName${index}`} value={medicine.name} onChange={(e) => handleInputChange(e, index)} style={{ marginBottom: '5px' }} />
                  </FormGroup>
                  <FormGroup>
                    <Label for={`medicineDescription${index}`}>Medicine Description</Label>
                    <Input type="text" name={`medicineDescription${index}`} id={`medicineDescription${index}`} value={medicine.description} onChange={(e) => handleInputChange(e, index)} style={{ marginBottom: '5px' }} />
                  </FormGroup>
                  <Button color="danger" onClick={() => removeMedicine(index)}>Remove Medicine</Button>
                </div>
              ))}
              <Button color="info" onClick={addMedicine}>Add Medicine</Button>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={selectedCategory ? updateCategory : createCategory}>
            {selectedCategory ? 'Update' : 'Create'}
          </Button>{' '}
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Categories ;
