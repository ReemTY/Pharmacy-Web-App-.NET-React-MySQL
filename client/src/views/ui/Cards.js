import React, { useState, useEffect } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import Header from '../../layouts/Header'; // Import Header component
import axios from '../../api/axios';

const MED_URL = '/Medicine'; // API URL for fetching medicines
const CAT_URL = '/category'; // API URL for fetching categories
const CART_ADD_URL = 'user/{userId}/request-medicine'; // API URL for adding items to the cart

const Cards = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold the user ID
  const [searchHistory, setSearchHistory] = useState([]);

  const [filteredMedicinesByCategory, setFilteredMedicinesByCategory] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    // Determine user role and set user ID accordingly
    const userRole = getUserRole(); // You need to implement a function to get the user's role
    if (userRole === 0) {
      setUserId(1);
    } else if (userRole === 1) {
      setUserId(2);
    } else {
      // Handle other user roles if needed
    }

    // Fetch medicines from API
    fetchMedicines();
    // Fetch categories from API
    fetchCategories();
  }, []);

  // Function to get the user's role (You need to implement this)
  const getUserRole = () => {
    return Math.floor(Math.random() * 2); // Returns either 0 or 1
  };

  const fetchMedicines = () => {
    axios.get(MED_URL)
      .then(response => {
        setMedicines(response.data);
      })
      .catch(error => {
        console.error('Error fetching medicines:', error);
        setError("Failed to fetch medicines. Please try again.");
      });
  };

  const fetchCategories = () => {
    axios.get(CAT_URL)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError("Failed to fetch categories. Please try again.");
      });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/medicine/${searchTerm}`);
      setMedicines(response.data);
      setError('');
      setSearchHistory(prevSearchHistory => [...prevSearchHistory, searchTerm]); // Add searchTerm to search history
    } catch (error) {
      console.error('Error searching medicines:', error);
      setError('Failed to search medicines. Please try again.');
      setMedicines([]);
    }
  };


  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    if (event.target.value !== "") {
      filterMedicines(event.target.value);
    } else {
      fetchMedicines();
    }
  };

  const filterMedicines = async (categoryId) => {
    try {
      const response = await axios.get(`/category/filter/${categoryId}`);
      setFilteredMedicinesByCategory(response.data);
    } catch (error) {
      console.error('Error filtering medicines:', error);
      setError("Failed to filter medicines. Please try again.");
    }
  };

  const requestMedicine = async (medicine) => {
    try {
      const response = await axios.post(`${CART_ADD_URL.replace('{userId}', userId)}`, {
        medicine: medicine.name, // Pass the medicine name to the API
      });

      console.log('Medicine added to cart:', response.data);
      setSuccessMessage("Medicine added to cart successfully!"); // Set success message
    } catch (error) {
      console.error('Error adding medicine to cart:', error);
      // You can handle error message or other error logic here
    }
  };


  return (
    <div>
      <Header />
      {successMessage && <div className="success">{successMessage}</div>}
      <Row className="mt-3">
        <Col md={6}>
          <Input
            type="text"
            placeholder="Search for medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="categorySelect">Filter by Category:</Label>
            <Input
              type="select"
              name="select"
              id="categorySelect"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category.id}>{category.name}</option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Button color="primary" onClick={handleSearch}>Search</Button>
        </Col>
      </Row>
      {error && <div className="error">{error}</div>}
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine, index) => (
            <tr key={index}>
              <td>{medicine.name}</td>
              <td>{categories.find(category => category.id === medicine.categoryId)?.name}</td>
              <td>{medicine.description}</td>
              <td>
                <Button color="primary" onClick={() => requestMedicine(medicine)}>Add to Cart</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedCategory && (
        <div>
          <h2>Filtered Medicines By Category</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicinesByCategory.map((medicine, index) => (
                <tr key={index}>
                  <td>{medicine.name}</td>
                  <td>{medicine.description}</td>
                  <td>{medicine.price}</td>
                  <td>
                    <Button color="primary" onClick={() => requestMedicine(medicine)}>Add to Cart</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <div className="search-history">
        <h2>Search History</h2>
        <ul className="list-unstyled">
          {searchHistory.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Cards;
