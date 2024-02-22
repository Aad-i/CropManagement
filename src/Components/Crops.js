import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Crops = ({ userID }) => {
  const [crops, setCrops] = useState([]);
  const [newCrop, setNewCrop] = useState({
    CropName: '',
    Quantity: 0,
    Purpose: '',
    HarvestDate: '',
    TotalYield: 0,
    Quality: '',
  });

  const [editCrop, setEditCrop] = useState({
    CropID: '',
    CropName: '',
    Quantity: 0,
    Purpose: '',
    HarvestDate: '',
    TotalYield: 0,
    Quality: '',
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
      // Clear the newCrop state
      setNewCrop({
        CropName: '',
        Quantity: 0,
        Purpose: '',
        HarvestDate: '',
        TotalYield: 0,
        Quality: '',
      });
    } catch (error) {
      console.error('Error creating crop:', error);
    }
  };

  const handleEditCrop = async () => {
    try {
      await axios.put(`http://localhost:5000/crops/user/${userID}/${editCrop.CropID}`, editCrop);
      // Refresh crops data after editing a crop
      const cropsResponse = await axios.get(`http://localhost:5000/crops/user/${userID}`);
      setCrops(cropsResponse.data);
      // Clear the editCrop state
      setEditCrop({
        CropID: '',
        CropName: '',
        Quantity: 0,
        Purpose: '',
        HarvestDate: '',
        TotalYield: 0,
        Quality: '',
      });
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
            type="text"
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
        <button onClick={handleCreateCrop}>Create Crop</button>
      </div>

      <div>
        <h3>Edit Crop</h3>
        <label>
          Crop ID:
          <input
            type="text"
            value={editCrop.CropID}
            onChange={(e) => setEditCrop({ ...editCrop, CropID: e.target.value })}
          />
        </label>
        <br />
        <label>
          Crop Name:
          <input
            type="text"
            value={editCrop.CropName}
            onChange={(e) => setEditCrop({ ...editCrop, CropName: e.target.value })}
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            value={editCrop.Quantity}
            onChange={(e) => setEditCrop({ ...editCrop, Quantity: Number(e.target.value) })}
          />
        </label>
        <br />
        <label>
          Purpose:
          <input
            type="text"
            value={editCrop.Purpose}
            onChange={(e) => setEditCrop({ ...editCrop, Purpose: e.target.value })}
          />
        </label>
        <br />
        <label>
          Harvest Date:
          <input
            type="text"
            value={editCrop.HarvestDate}
            onChange={(e) => setEditCrop({ ...editCrop, HarvestDate: e.target.value })}
          />
        </label>
        <br />
        <label>
          Total Yield:
          <input
            type="number"
            value={editCrop.TotalYield}
            onChange={(e) => setEditCrop({ ...editCrop, TotalYield: Number(e.target.value) })}
          />
        </label>
        <br />
        <label>
          Quality:
          <input
            type="text"
            value={editCrop.Quality}
            onChange={(e) => setEditCrop({ ...editCrop, Quality: e.target.value })}
          />
        </label>
        <br />
        <button onClick={handleEditCrop}>Edit Crop</button>
      </div>

      <div>
        <h3>Crops List</h3>
        <ul>
          {crops.map((crop) => (
            <li key={crop.CropID}>
              {crop.CropName} - Quantity: {crop.Quantity}
              <button onClick={() => handleDeleteCrop(crop.CropID)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Crops;
