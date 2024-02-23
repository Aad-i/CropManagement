import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import Crops from './Components/Crops';
import Inventory from './Components/Inventory';


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

        </Routes>
      </div>
    </Router>
  );
};

export default App;

