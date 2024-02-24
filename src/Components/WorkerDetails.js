// WorkerDetails.js

import React from 'react';

const WorkerDetails = ({ worker, onClose }) => {
  return (
    <div className="popup">
      <h3>Worker Details</h3>
      <p>Worker ID: {worker.WorkerID}</p>
      <p>Worker Name: {worker.WorkerName}</p>
      <p>Contact Number: {worker.ContactNumber}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default WorkerDetails;
