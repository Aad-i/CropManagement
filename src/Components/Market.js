// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Market = () => {
  // State to store market items
  const [marketItems, setMarketItems] = useState([]);

  // Fetch market items when the component mounts
  useEffect(() => {
    const fetchMarketItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/market-items'); // Corrected endpoint
        setMarketItems(response.data);
      } catch (error) {
        console.error('Error fetching market items:', error);
      }
    };
  
    fetchMarketItems();
  }, []);  

  // Function to handle the "Buy" action
  const handleBuy = (itemID) => {
    // Implement the buy action, e.g., redirect to a checkout page
    console.log(`Buy action for item with ID: ${itemID}`);
  };

  return (
    <div>
      <h2>Market Page</h2>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Grade</th>
            <th>Price</th>
            <th>Seller ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {marketItems.map((item) => (
            <tr key={item.ItemID}>
              <td>{item.ItemID}</td>
              <td>{item.CropName}</td>
              <td>{item.TotalYield}</td>
              <td>{item.Quality}</td>
              <td>{item.Price}</td>
              <td>{item.SellerID}</td>
              <td>
                <button onClick={() => handleBuy(item.ItemID)}>Buy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Market;
