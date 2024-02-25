// CounterpartyDetailsPopup.js
import React from 'react';

const CounterpartyDetails = ({ counterparty, onClose }) => {
  return (
    <div className="counterparty-details-popup">
      <h3>Counterparty Details</h3>
      {/* <p>ID: {counterparty.UserID}</p> */}
      <p>Name: {counterparty.UserName}</p>
      <p>Contact Number: {counterparty.PhoneNumber}</p>
      <p>Email: {counterparty.Email}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CounterpartyDetails;
