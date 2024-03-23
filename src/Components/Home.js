import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss'; 

const Home = () => {
  return (
    <div className="landing-page-container">
      <h2 className="landing-page-title">Farm.Connect</h2>
      <p className='landing-page-description'>Your smart Farm Inventory Management system</p>
      <p className="landing-page-description">Explore the features and get started with our farm inventory management app:</p>

      <div className="cta-buttons-container">
        <Link to="/register" className="cta-link">
          <button className="cta-button">Get Started</button>
        </Link>
        <Link to="/login" className="cta-link">
          <button className="cta-button">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
