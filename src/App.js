import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import Crops from './Components/Crops';
import Inventory from './Components/Inventory';
import Transactions from './Components/Transactions';
import EquipmentsUsage from './Components/EquipmentsUsage';
import EquipmentsDetailsPage from './Components/EquipmentDetails';
import Market from './Components/Market';
import SellItem from './Components/SellItem';
import Checkout from './Components/Checkout';
import Logout from './Components/Logout';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/crops/:userID" element={<Crops/>} />
          <Route path="/inventory/:userID" element={<Inventory />} />
          <Route path="/transactions/:userID" element={<Transactions />} />
          <Route path="/equipments-usage/:userID" element={<EquipmentsUsage />} />
          <Route path="/equipments/:userID" element={<EquipmentsDetailsPage/>} />
          <Route path="/market/:userID" element={<Market/>} />
          <Route path="/market/:userID/sell-item" element={<SellItem/>} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

