import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const Grid = () => {
  const [userId, setUserId] = useState(null); // State to store the dynamic userId
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Function to fetch user data or set userId based on authentication status
  const fetchUserData = () => {
    // Assume you have a function to retrieve userId from authentication state
    // For example, if using JWT, you might decode the token to get userId
    // Or if using a state management library, you might get userId from the store
    // For this example, let's assume a hypothetical function called getAuthenticatedUserId
    const userIdFromAuth = getAuthenticatedUserId(); // Call function to get userId
    setUserId(userIdFromAuth);
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when component mounts
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await axios.get(`/user/${userId}/search-history`);
      if (response.status === 200) {
        setSearchHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching search history:', error.message);
    }
  };

  const fetchMedicines = async (searchString) => {
    try {
      const response = await axios.get(`/medicine/${userId}/${searchString}`);
      if (response.status === 200) {
        setSearchResults(response.data);
        // After fetching medicines, record the search history
        await axios.post(`/user/${userId}/search-history`, { searchQuery: searchString });
        // Fetch updated search history
        fetchSearchHistory();
      }
    } catch (error) {
      console.error('Error fetching medicines:', error.message);
    }
  };

  // Function to handle search
  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      fetchMedicines(searchInput.trim());
    }
  };

  // Placeholder function for demonstration
  const getAuthenticatedUserId = () => {
    // Here you would implement the logic to retrieve the userId
    // from your authentication state or wherever it's stored
    // This is just a placeholder, replace it with your actual logic
    return 4; // Replace with the actual userId
  };

  return (
    <div className="medicine-search-page">
      <h1>Medicine Search</h1>
      
      {/* Search Component */}
      <div className="search">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for medicines..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results */}
      <div className="search-results">
        <h2>Search Results</h2>
        <ul>
          {searchResults.map((medicine, index) => (
            <li key={index}>{medicine.name}</li>
          ))}
        </ul>
      </div>

      {/* Search History */}
      <div className="search-history">
        <h2>Search History</h2>
        <ul>
          {searchHistory.map((search, index) => (
            <li key={index}>{search.searchQuery}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Grid;
