import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Crops = () => {
  const { userID } = useParams();
  const [crops, setCrops] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newCrop, setNewCrop] = useState({
    CropID: '',
    CropName: '',
    Quantity: 0,
    Purpose: '',
    HarvestDate: '',
    TotalYield: 0,
    Quality: '',
    UserID: userID,
  });

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const cropsResponse = await axios.get(`http://localhost:5000/crops/user/${userID}`);
        setCrops(cropsResponse.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCrops();
  }, [userID]);

  const handleCreateCrop = async () => {
    try {
      await axios.post(`http://localhost:5000/crops/user/${userID}`, newCrop);
      // Refresh crops data after creating a new crop
      const cropsResponse = await axios.get(`http://localhost:5000/crops/user/${userID}`);
      setCrops(cropsResponse.data);
      // Clear the newCrop state and set UserID to the userID from the URL
      setNewCrop({
        CropID: '',
        CropName: '',
        Quantity: 0,
        Purpose: '',
        HarvestDate: '',
        TotalYield: 0,
        Quality: '',
        UserID: userID,
      });
    } catch (error) {
      console.error('Error creating crop:', error);
    }
  };

  const handleEditCrop = (crop) => {
    // Set the details of the selected crop in the newCrop state for editing
    setNewCrop({
      CropID: crop.CropID,
      CropName: crop.CropName,
      Quantity: crop.Quantity,
      Purpose: crop.Purpose,
      HarvestDate: crop.HarvestDate,
      TotalYield: crop.TotalYield,
      Quality: crop.Quality,
      UserID: userID,
    });
    setEditMode(true);
  };

  const handleConfirmEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/crops/user/${userID}/${newCrop.CropID}`, newCrop);
      // Refresh crops data after editing a crop
      const cropsResponse = await axios.get(`http://localhost:5000/crops/user/${userID}`);
      setCrops(cropsResponse.data);
      // Clear the newCrop state
      setNewCrop({
        CropID: '',
        CropName: '',
        Quantity: 0,
        Purpose: '',
        HarvestDate: '',
        TotalYield: 0,
        Quality: '',
        UserID: userID,
      });
      setEditMode(false);

    } catch (error) {
      console.error('Error editing crop:', error);
    }
  };

  const handleDeleteCrop = async (cropID) => {
    try {
      await axios.delete(`http://localhost:5000/crops/user/${userID}/${cropID}`);
      // Refresh crops data after deleting a crop
      const cropsResponse = await axios.get(`http://localhost:5000/crops/user/${userID}`);
      setCrops(cropsResponse.data);
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  return (
    <div>
      <h2>Crops</h2>
      <div>
        <h3>Create New Crop</h3>
        <label>
          Crop ID:
          <input
            type="text"
            value={newCrop.CropID}
            onChange={(e) => setNewCrop({ ...newCrop, CropID: e.target.value })}
          />
        </label>
        <br />
        <label>
          Crop Name:
          <input
            type="text"
            value={newCrop.CropName}
            onChange={(e) => setNewCrop({ ...newCrop, CropName: e.target.value })}
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            value={newCrop.Quantity}
            onChange={(e) => setNewCrop({ ...newCrop, Quantity: Number(e.target.value) })}
          />
        </label>
        <br />
        <label>
          Purpose:
          <input
            type="text"
            value={newCrop.Purpose}
            onChange={(e) => setNewCrop({ ...newCrop, Purpose: e.target.value })}
          />
        </label>
        <br />
        <label>
          Harvest Date:
          <input
            type="date"
            value={newCrop.HarvestDate}
            onChange={(e) => setNewCrop({ ...newCrop, HarvestDate: e.target.value })}
          />
        </label>
        <br />
        <label>
          Total Yield:
          <input
            type="number"
            value={newCrop.TotalYield}
            onChange={(e) => setNewCrop({ ...newCrop, TotalYield: Number(e.target.value) })}
          />
        </label>
        <br />
        <label>
          Quality:
          <input
            type="text"
            value={newCrop.Quality}
            onChange={(e) => setNewCrop({ ...newCrop, Quality: e.target.value })}
          />
        </label>
        <br />
        {editMode ? (
          <button onClick={handleConfirmEdit}>Confirm Edit</button>
        ) : (
          <button onClick={handleCreateCrop}>Add Crop</button>
        )}
      </div>

      <div>
        <h3>Crops List</h3>
        <table>
          <thead>
            <tr>
              <th>Crop ID</th>
              <th>Crop Name</th>
              <th>Quantity</th>
              <th>Purpose</th>
              <th>Harvest Date</th>
              <th>Total Yield</th>
              <th>Quality</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <tr key={crop.CropID}>
                <td>{crop.CropID}</td>
                <td>{crop.CropName}</td>
                <td>{crop.Quantity}</td>
                <td>{crop.Purpose}</td>
                <td>{new Date(crop.HarvestDate).toLocaleDateString()}</td>
                <td>{crop.TotalYield}</td>
                <td>{crop.Quality}</td>
                <td>
                  <button onClick={() => handleEditCrop(crop)}>Edit</button>
                  <button onClick={() => handleDeleteCrop(crop.CropID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Crops;
