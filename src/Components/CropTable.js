// CropTable.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CropTable = () => {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    // Fetch crops data from the API endpoint
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crops');
        setCrops(response.data);
      } catch (error) {
        console.error('Error fetching crops data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Crops Table</h2>
      <table>
        <thead>
          <tr>
            <th>Crop ID</th>
            <th>Crop Name</th>
            <th>Quantity</th>
            <th>Purpose</th>
            <th>Harvest Date</th>
            <th>Total Yield</th>
            <th>Quality</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((crop) => (
            <tr key={crop.CropID}>
              <td>{crop.CropID}</td>
              <td>{crop.CropName}</td>
              <td>{crop.Quantity}</td>
              <td>{crop.Purpose}</td>
              <td>{crop.HarvestDate}</td>
              <td>{crop.TotalYield}</td>
              <td>{crop.Quality}</td>
              <td>{crop.UserID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CropTable;
