import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.scss';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/register', formData);

      if (response && response.data) {
        console.log(response.data);
        alert('Registration successful');

        // Redirect to the login page after successful registration
        navigate('/login');
      } else {
        console.error('Unexpected response format:', response);
        alert('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        console.error('Server response:', error.response.data);
        alert(error.response.data.error || 'Registration failed');
      } else {
        alert('Internal Server Error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">User Registration</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" required />
        </label>

        <label className="form-label">
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" required />
        </label>

        <label className="form-label">
          Phone Number:
          <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-input" required />
        </label>

        <label className="form-label">
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
        </label>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
