import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.scss'; // Import the SCSS file

const Login = () => {

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:5000/login', formData);
      const token = response.data.token; // JWT token from the server

      // Store the token securely (in localStorage)
      localStorage.setItem('token', token);

      console.log('Login successful');

      // Redirect to the dashboard 
      navigate('/dashboard');
    } catch (error) {
      console.error(error.response.data);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className='login-container-content'>
        <h2 className="login-title">User Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" required />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>

  );
};

export default Login;
