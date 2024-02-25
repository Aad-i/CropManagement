// Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.scss'; // Import the SCSS file

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="user-dashboard">
      <h2 className="dashboard-title">User Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      {userData && (
        <div className="user-info">
          <p>Username: {userData.Username}</p>
          <p>Contact Number: {userData.PhoneNumber}</p>
          <p>Email: {userData.Email}</p>

          {/* Summary Cards */}
          <div className="summary-cards">
            <Link to={`/crops/${userData.UserID}`} className="summary-card">
              <h3 className="card-title">Total Crops</h3>
              <p className="card-description">Get an overview of your crops.</p>
            </Link>

            <Link to={`/inventory/${userData.UserID}`} className="summary-card">
              <h3 className="card-title">Inventories</h3>
              <p className="card-description">View and manage your inventories.</p>
            </Link>

            <Link to={`/transactions/${userData.UserID}`} className="summary-card">
              <h3 className="card-title">Transactions</h3>
              <p className="card-description">View your transaction history.</p>
            </Link>

            <Link to={`/equipments-usage/${userData.UserID}`} className="summary-card">
              <h3 className="card-title">Equipments Usage</h3>
              <p className="card-description">View and manage your equipment usage.</p>
            </Link>

            <Link to={`/equipments/${userData.UserID}`} className="summary-card">
              <h3 className="card-title">Equipments</h3>
              <p className="card-description">View all equipment details.</p>
            </Link>

            <Link to={`/market/${userData.UserID}`} className="summary-card">
              <h3 className="card-title">Market</h3>
              <p className="card-description">Explore and manage market items.</p>
            </Link>
          </div>

          {/* Add more summary cards for other metrics */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
