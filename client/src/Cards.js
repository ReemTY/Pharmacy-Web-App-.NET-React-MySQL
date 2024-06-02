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

import axios from '../../api/axios';

const MED_URL = '/Medicine'; //api url
const CAT_URL = '/category'; //api url

// const SEARCH_URL = `/medicine/${userId}/${searchString}`; //api url
const FIL_BY_CAT_URL = '/category/{searchString}'

const Cards = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);
  const [filteredMedicinesByCategory, setFilteredMedicinesByCategory] = useState([]);
  const [userId, setUserId] = useState(null); // State to hold the user ID


  useEffect(() => {
    // Fetch medicines from API
    fetchMedicines();
    // Fetch categories from API
    fetchCategories();
  }, []);


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
  const getUserRole = () => {
    return Math.floor(Math.random() * 2); // Returns either 0 or 1
  };

  const userRole = getUserRole(); // You need to implement a function to get the user's role
  if (userRole === 0) {
    setUserId(1);
  } else if (userRole === 1) {
    setUserId(1);
  } else {
    // Handle other user roles if needed
  }

  const filterMedicines = async (categoryId) => {
    try {
      const response = await axios.get(`/category/filter/${categoryId}`);
      setFilteredMedicinesByCategory(response.data);
    } catch (error) {
      console.error('Error filtering medicines:', error);
      setError("Failed to filter medicines. Please try again.");
    }
  };
  
  
  const addToCart = (medicine) => {
    // Implement logic to add medicine to cart
    console.log('Added to cart:', medicine);
  };

  return (
    <div>
      <Row>
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
            <label htmlFor="categorySelect">Filter by Category:</label>
            <select
              id="categorySelect"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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
                <Button color="primary" onClick={() => addToCart(medicine)}>Add to Cart</Button>
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
                    <Button color="primary" onClick={() => addToCart(medicine)}>Add to Cart</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
  
};

export default Cards;
