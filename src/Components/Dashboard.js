// Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Crops from './Crops';

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
    <div>
      <h2>User Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userData && (
        <div>
          {/* <p>User ID: {userData.UserID}</p> */}
          <p>Username: {userData.Username}</p>
          <p>Contact Number: {userData.PhoneNumber}</p>
          <p>Email: {userData.Email}</p>


          {/* Summary Cards */}
          <div>
            <Link to={`/crops/${userData.UserID}`}>
              <div>
                <h3>Total Crops</h3>
                <p>Get an overview of your crops.</p>
              </div>
            </Link>
          </div>

          <div>
            <Link to={`/inventory/${userData.UserID}`}>
              <div>
                <h3>Inventories</h3>
                <p>View and manage your inventorise.</p>
              </div>
            </Link>
          </div>

          <div>
            <Link to={`/transactions/${userData.UserID}`}>
              <div className="card">
                <h3>Transactions</h3>
                <p>View your transaction history.</p>
              </div>
            </Link>
          </div>

          <div>
            <Link to={`/equipments-usage/${userData.UserID}`}>
              <div className="card">
                <h3>Equipments Usage</h3>
                <p>View and manage your equipment usage.</p>
              </div>
            </Link>
          </div>

          <div>
            <Link to={`/equipments/${userData.UserID}`}>
              <div className="card">
                <h3>Equipments</h3>
                <p>View all equipment details.</p>
              </div>
            </Link>
          </div>

          <div>
        <Link to="/market">
          <div className="card">
            <h3>Market</h3>
            <p>Explore and manage market items.</p>
          </div>
        </Link>
      </div>


          {/* Add more summary cards for other metrics */}

        </div>
      )}
    </div>
  );
};

export default Dashboard;
