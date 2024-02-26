import React from 'react';
import './WorkerDetails.scss'

const WorkerDetails = ({ worker, onClose }) => {
  return (
    <div className="worker-details-popup">
      <h3 className="popup-title">Worker Details</h3>
      <p className="worker-info">Worker ID: {worker.WorkerID}</p>
      <p className="worker-info">Worker Name: {worker.WorkerName}</p>
      <p className="worker-info">Contact Number: {worker.ContactNumber}</p>
      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default WorkerDetails;
