// frontend/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// frontend/src/components/Login.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/login`, formData);
    setUser(data);
    localStorage.setItem('token', data.token);
    navigate('/');
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error);
    alert(error.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="form-container">
          <h2>Worship Lord Krishna</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
