// Dashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
          <p>User ID: {userData.UserID}</p>
          <p>Username: {userData.Username}</p>

          {/* Summary Cards */}
          <div>
            <Link to="/crops">
              <div>
                <h3>Total Crops</h3>
                <p>Get an overview of your crops.</p>
              </div>
            </Link>
          </div>

          <div>
            <Link to="/storage-locations">
              <div>
                <h3>Storage Locations</h3>
                <p>View and manage your storage locations.</p>
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
