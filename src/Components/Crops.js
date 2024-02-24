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
    Purpose: '',
    HarvestDate: '',
    TotalYield: 0,
    Quality: '',
    UserID: userID,
  });

  const [qualityFilter, setQualityFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('');

  useEffect(() => {
    fetchCrops();
  }, [userID, qualityFilter, purposeFilter]);

  const fetchCrops = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/crops/user/${userID}`, {
        params: {
          quality: qualityFilter,
          purpose: purposeFilter,
        },
      });
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const handleCreateCrop = async () => {
    if (isAnyFieldEmpty()) {
      alert('Please fill out all required fields.');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/crops/user/${userID}`, newCrop);
      // Refresh crops data after creating a new crop
      fetchCrops();
      // Clear the newCrop state and set UserID to the userID from the URL
      setNewCrop({
        CropID: '',
        CropName: '',
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
      Purpose: crop.Purpose,
      HarvestDate: crop.HarvestDate,
      TotalYield: crop.TotalYield,
      Quality: crop.Quality,
      UserID: userID,
    });
    setEditMode(true);
  };

  const handleConfirmEdit = async () => {
    if (isAnyFieldEmpty()) {
      alert('Please fill out all required fields.');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/crops/user/${userID}/${newCrop.CropID}`, newCrop);
      // Refresh crops data after editing a crop
      fetchCrops();
      // Clear the newCrop state
      setNewCrop({
        CropID: '',
        CropName: '',
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
      fetchCrops();
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  const handleCancelEdit = () => {
    // Clear the newCrop state and exit edit mode
    setNewCrop({
      CropID: '',
      CropName: '',
      Purpose: '',
      HarvestDate: '',
      TotalYield: 0,
      Quality: '',
      UserID: userID,
    });
    setEditMode(false);
  };

  const isAnyFieldEmpty = () => {
    return (
      !newCrop.CropID ||
      !newCrop.CropName ||
      !newCrop.Purpose ||
      !newCrop.HarvestDate ||
      !newCrop.TotalYield ||
      !newCrop.Quality
    );
  };

  const filteredCrops = crops.filter((crop) => {
    const qualityMatch = !qualityFilter || crop.Quality === qualityFilter;
    const purposeMatch = !purposeFilter || crop.Purpose === purposeFilter;
    return qualityMatch && purposeMatch;
  });

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
            required
          />
        </label>
        <br />
        <label>
          Crop Name:
          <input
            type="text"
            value={newCrop.CropName}
            onChange={(e) => setNewCrop({ ...newCrop, CropName: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          Purpose:
          <select
            value={newCrop.Purpose}
            onChange={(e) => setNewCrop({ ...newCrop, Purpose: e.target.value })}
            required
          >
            <option value="">Select Purpose</option>
            <option value="Cultivation">Cultivation</option>
            <option value="Sale">Sale</option>
          </select>
        </label>
        <br />
        <label>
          Harvest Date:
          <input
            type="date"
            value={newCrop.HarvestDate}
            onChange={(e) => setNewCrop({ ...newCrop, HarvestDate: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          Total Yield:
          <input
            type="number"
            min={0}
            value={newCrop.TotalYield}
            onChange={(e) => setNewCrop({ ...newCrop, TotalYield: Number(e.target.value) })}
            required
          />
        </label>
        <br />
        <label>
          Quality:
          <select
            value={newCrop.Quality}
            onChange={(e) => setNewCrop({ ...newCrop, Quality: e.target.value })}
            required
          >
            <option value="">Select Quality</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
        <br />
        {editMode ? (
          <>
            <button onClick={handleConfirmEdit}>Confirm Edit</button>
            <button onClick={handleCancelEdit}>Cancel Edit</button>
          </>
        ) : (
          <button onClick={handleCreateCrop}>Add Crop</button>
        )}
      </div>

      <div>
        <h3>Crops List</h3>
        {/* Add filters for Quality and Purpose */}
        <label>
          Quality Filter:
          <select
            value={qualityFilter}
            onChange={(e) => setQualityFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
        <label>
          Purpose Filter:
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Cultivation">Cultivation</option>
            <option value="Sale">Sale</option>
          </select>
        </label>
        <table>
          <thead>
            <tr>
              <th>Crop ID</th>
              <th>Crop Name</th>
              <th>Purpose</th>
              <th>Harvest Date</th>
              <th>Total Yield</th>
              <th>Quality</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {filteredCrops.map((crop) => (
              <tr key={crop.CropID}>
                <td>{crop.CropID}</td>
                <td>{crop.CropName}</td>
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
