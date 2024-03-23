import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import WorkerDetails from './WorkerDetails'; // Import the WorkerDetails component
import './EquipmentsUsage.scss'

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
    <div className="equipments-usage-container">
      <h2 className="equipments-usage-title">Equipment Usage</h2>

      <button className="view-all-btn" onClick={handleViewAllEquipments}>
        View All Equipments
      </button>

      <div className="equipments-table-container">
        <table className="equipments-table">
          <thead>
            <tr>
              <th className="table-header">Equipment ID</th>
              <th className="table-header">Usage Date</th>
              <th className="table-header">Worker ID</th>
              <th className="table-header">Quantity Used</th>
              <th className="table-header">Borrowing Time</th>
              <th className="table-header">Returning Time</th>
              <th className="table-header">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {equipmentUsage.map((usage) => (
              <tr key={`${usage.EquipmentID}-${usage.UsageDate}`} className='table-row'>
                <td className="table-cell">{usage.EquipmentID}</td>
                <td className="table-cell">{new Date(usage.UsageDate).toLocaleDateString()}</td> 
                <td
                  className="table-cell worker-id"
                  onClick={() => handleWorkerClick(usage.WorkerID)}
                >
                  {usage.WorkerID}
                </td>
                <td className="table-cell">{usage.QuantityUsed}</td>
                <td className="table-cell">{usage.BorrowingTime}</td>
                <td className="table-cell">{usage.ReturningTime}</td>
                <td className="table-cell">{usage.Purpose}</td>
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
