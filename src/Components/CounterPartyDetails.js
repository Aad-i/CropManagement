// CounterpartyDetailsPopup.js
import React from 'react';

const CounterpartyDetails = ({ counterparty, onClose }) => {
  return (
    <div className="counterparty-details-popup">
      <h3>Counterparty Details</h3>
      <p>ID: {counterparty.CounterpartyID}</p>
      <p>Name: {counterparty.CounterpartyName}</p>
      <p>Role: {counterparty.CounterpartyRole}</p>
      <p>Contact Number: {counterparty.ContactNumber}</p>
      <p>Email: {counterparty.Email}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CounterpartyDetails;
