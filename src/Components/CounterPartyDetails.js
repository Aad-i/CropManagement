import React from 'react';
import './CounterPartyDetails.scss'; // Importing component styles

// Functional component to display counterparty details
const CounterpartyDetails = ({ counterparty, onClose }) => {
  return (
    <div className="counterparty-details-popup">
      {/* Popup title */}
      <h3 className="popup-title">Counterparty Details</h3>
      
      {/* Display counterparty's name */}
      <p className="user-name">Name: {counterparty.UserName}</p>
      
      {/* Display counterparty's contact number */}
      <p className="contact-number">Contact Number: {counterparty.PhoneNumber}</p>
      
      {/* Display counterparty's email */}
      <p className="user-email">Email: {counterparty.Email}</p>
      
      {/* Button to close the popup */}
      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default CounterpartyDetails;
