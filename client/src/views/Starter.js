import React, { useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const LOGIN_URL = '/user/login';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for navigation

  const { email, password } = formData;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(LOGIN_URL, {
        email,
        password
      });
      const { userRole } = response.data;
      localStorage.setItem('userRole', userRole);
      if (userRole === '1') { // Admin
        navigate('./dashboard'); // Use navigate for navigation
      } else if (userRole === '0') { // User
        navigate('./register'); // Use navigate for navigation
      }

    } catch (error) {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            className="form-control"
            minLength={6} // Example: Minimum password length
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p className="signup-link">
        Don't have an account yet? <Link to="/register">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
