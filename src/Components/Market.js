// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Market = () => {
  const navigate = useNavigate();
  const { userID } = useParams();

  // State to store market items
  const [marketItems, setMarketItems] = useState([]);

  // Fetch market items when the component mounts
  useEffect(() => {
    const fetchMarketItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/market-items/user/${userID}`);
        setMarketItems(response.data);
      } catch (error) {
        console.error('Error fetching market items:', error);
      }
    };

    fetchMarketItems();
  }, [userID]);

  // Function to handle the "Buy" action
  const handleBuy = (item) => {
    // Navigate to the Checkout component with the selected item details
    navigate(`/checkout`, { state: { item, userID } });
  };

  // Function to handle the "Sell" action
  const handleSell = () => {
    navigate(`sell-item/`);
  };

  return (
    <div>
      <h2>Market Page</h2>
      <button onClick={handleSell}>Sell Item</button>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Grade</th>
            <th>Unit Price</th>
            <th>Price</th>
            <th>Seller ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {marketItems.map((item) => (
            item.IsHidden === undefined || item.IsHidden === 0 ? (
              <tr key={item.ItemID}>
                <td>{item.ItemID}</td>
                <td>{item.CropName}</td>
                <td>{item.TotalYield}</td>
                <td>{item.Quality}</td>
                <td>{item.UnitPrice}</td>
                <td>{item.Price}</td>
                <td>{item.SellerID}</td>
                <td>
                  <button onClick={() => handleBuy(item)}>Buy</button>
                </td>
              </tr>
            ) : null
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Market;
