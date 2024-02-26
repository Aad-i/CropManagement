import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Crops.scss';

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
          excludeHidden: true, //to exclude hidden crops
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
    <div className="crops-container">
      <h2 className="crops-title">Crops</h2>
      <div className="create-crop-section">
        <h3 className="create-crop-title">Create New Crop</h3>
        <label className="form-label">
          Crop ID:
          <input
            type="text"
            className="form-input"
            value={newCrop.CropID}
            onChange={(e) => setNewCrop({ ...newCrop, CropID: e.target.value })}
            required
          />
        </label>
        <br />
        <label className="form-label">
          Crop Name:
          <input
            type="text"
            className="form-input"
            value={newCrop.CropName}
            onChange={(e) => setNewCrop({ ...newCrop, CropName: e.target.value })}
            required
          />
        </label>
        <br />
        <label className="form-label">
          Purpose:
          <select
            value={newCrop.Purpose}
            onChange={(e) => setNewCrop({ ...newCrop, Purpose: e.target.value })}
            className="form-input"
            required
          >
            <option value="">Select Purpose</option>
            <option value="Cultivation">Cultivation</option>
            <option value="Sale">Sale</option>
          </select>
        </label>
        <br />
        <label className="form-label">
          Harvest Date:
          <input
            type="date"
            className="form-input"
            value={newCrop.HarvestDate}
            onChange={(e) => setNewCrop({ ...newCrop, HarvestDate: e.target.value })}
            required
          />
        </label>
        <br />
        <label className="form-label">
          Total Yield:
          <input
            type="number"
            min={0}
            className="form-input"
            value={newCrop.TotalYield}
            onChange={(e) => setNewCrop({ ...newCrop, TotalYield: Number(e.target.value) })}
            required
          />
        </label>
        <br />
        <label className="form-label">
          Quality:
          <select
            value={newCrop.Quality}
            onChange={(e) => setNewCrop({ ...newCrop, Quality: e.target.value })}
            className="form-input"
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
            <button className="form-button" onClick={handleConfirmEdit}>Confirm Edit</button>
            <button className="form-button" onClick={handleCancelEdit}>Cancel Edit</button>
          </>
        ) : (
          <button className="form-button" onClick={handleCreateCrop}>Add Crop</button>
        )}
      </div>

      <div className="crops-list-section">
        <h3 className="crops-list-title">Crops List</h3>
        <div className="filter-section">
          <label className="filter-label">
            Quality Filter:
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </label>
          <label className="filter-label">
            Purpose Filter:
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="Cultivation">Cultivation</option>
              <option value="Sale">Sale</option>
            </select>
          </label>
        </div>

        <table className="crops-table">
          <thead>
            <tr>
              <th className="table-header">Crop ID</th>
              <th className="table-header">Crop Name</th>
              <th className="table-header">Purpose</th>
              <th className="table-header">Harvest Date</th>
              <th className="table-header">Total Yield</th>
              <th className="table-header">Quality</th>
              <th className="table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCrops.map((crop) => (
              <tr key={crop.CropID} className="crop-row">
                <td className="table-cell">{crop.CropID}</td>
                <td className="table-cell">{crop.CropName}</td>
                <td className="table-cell">{crop.Purpose}</td>
                <td className="table-cell">{new Date(crop.HarvestDate).toLocaleDateString()}</td>
                <td className="table-cell">{crop.TotalYield}</td>
                <td className="table-cell">{crop.Quality}</td>
                <td className="table-cell action-buttons">
                  <button className="action-button" onClick={() => handleEditCrop(crop)}>Edit</button>
                  <button className="action-button" onClick={() => handleDeleteCrop(crop.CropID)}>Delete</button>
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
