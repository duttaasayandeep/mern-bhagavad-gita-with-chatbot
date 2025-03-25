// frontend/src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    phone: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // frontend/src/components/Register.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${API_URL}/api/auth/register`, formData);
    navigate('/login');
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error);
    alert(error.response?.data?.message || "Registration failed");
  }
};


  return (
    <div className="register-page">
      <div className="register-overlay">
        <div className="form-container">
          <h2>Become a Seeker</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              onChange={handleChange}
              required
            />
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
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
