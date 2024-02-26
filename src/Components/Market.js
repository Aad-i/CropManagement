// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Market.scss'

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
    <div className="market-container">
      <h2>Market Page</h2>
      <button className="sell-item-button" onClick={handleSell}>Sell Item</button>
      <table className="market-table">
        <thead>
          <tr>
            <th className="table-header">Item ID</th>
            <th className="table-header">Item Name</th>
            <th className="table-header">Quantity</th>
            <th className="table-header">Grade</th>
            <th className="table-header">Unit Price</th>
            <th className="table-header">Price</th>
            <th className="table-header">Seller ID</th>
            <th className="table-header">Action</th>
          </tr>
        </thead>
        <tbody>
          {marketItems.map((item) => (
            item.IsHidden === undefined || item.IsHidden === 0 ? (
              <tr key={item.ItemID} className="table-row">
                <td className="table-cell">{item.ItemID}</td>
                <td className="table-cell">{item.CropName}</td>
                <td className="table-cell">{item.TotalYield}</td>
                <td className="table-cell">{item.Quality}</td>
                <td className="table-cell">{item.UnitPrice}</td>
                <td className="table-cell">{item.Price}</td>
                <td className="table-cell">{item.SellerID}</td>
                <td className="table-cell">
                  <button className="buy-button" onClick={() => handleBuy(item)}>Buy</button>
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
