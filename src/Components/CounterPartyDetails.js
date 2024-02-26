// CounterpartyDetailsPopup.js
import React from 'react';
import './CounterPartyDetails.scss'

const CounterpartyDetails = ({ counterparty, onClose }) => {
  return (
    <div className="counterparty-details-popup">
      <h3 className="popup-title">Counterparty Details</h3>
      {/* <p className="user-id">ID: {counterparty.UserID}</p> */}
      <p className="user-name">Name: {counterparty.UserName}</p>
      <p className="contact-number">Contact Number: {counterparty.PhoneNumber}</p>
      <p className="user-email">Email: {counterparty.Email}</p>
      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default CounterpartyDetails;
