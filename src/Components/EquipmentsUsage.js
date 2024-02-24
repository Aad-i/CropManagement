// EquipmentsUsage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import WorkerDetails from './WorkerDetails'; // Import the WorkerDetails component

const EquipmentsUsage = () => {
  const { userID } = useParams();
  const [equipmentUsage, setEquipmentUsage] = useState([]);
  const [showWorkerDetails, setShowWorkerDetails] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEquipmentUsage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/equipments-usage/user/${userID}`);
        setEquipmentUsage(response.data);
      } catch (error) {
        console.error('Error fetching equipment usage:', error);
      }
    };

    fetchEquipmentUsage();
  }, [userID]);

  const handleViewAllEquipments = () => {
    navigate(`/equipments/${userID}`);
  };

  const handleWorkerClick = async (workerID) => {
    try {
      console.log('Worker ID clicked:', workerID);
      const response = await axios.get(`http://localhost:5000/workers/${workerID}`);
      setSelectedWorker(response.data);
      setShowWorkerDetails(true);
    } catch (error) {
      console.error('Error fetching worker details:', error);
    }
  };

  const handleClosePopup = () => {
    setShowWorkerDetails(false);
  };

  return (
    <div>
      <h2>Equipment Usage</h2>

      <button onClick={handleViewAllEquipments}>
        View All Equipments
      </button>

      <div>
        <table>
          <thead>
            <tr>
              <th>Equipment ID</th>
              <th>Usage Date</th>
              <th>Worker ID</th>
              <th>Quantity Used</th>
              <th>Borrowing Time</th>
              <th>Returning Time</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {equipmentUsage.map((usage) => (
              <tr key={`${usage.EquipmentID}-${usage.UsageDate}`}>
                <td>{usage.EquipmentID}</td>
                <td>{new Date(usage.UsageDate).toLocaleDateString()}</td> 
                <td
                  onClick={() => handleWorkerClick(usage.WorkerID)}
                  style={{ cursor: 'pointer', color: 'blue' }}
                >
                  {usage.WorkerID}
                </td>
                <td>{usage.QuantityUsed}</td>
                <td>{usage.BorrowingTime}</td>
                <td>{usage.ReturningTime}</td>
                <td>{usage.Purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {showWorkerDetails && (
          <WorkerDetails
            worker={selectedWorker}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
};

export default EquipmentsUsage;
