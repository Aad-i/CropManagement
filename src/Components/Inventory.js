import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Inventory.scss'

const Inventory = () => {
  const { userID } = useParams();
  const [inventory, setInventory] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newInventoryItem, setNewInventoryItem] = useState({
    InventoryID: '',
    LocationID: '',
    CropID: '',
    TotalCapacity: 0,
    OccupiedCapacity: 0,
    UserID: userID,
  });
  const [newLocation, setNewLocation] = useState({
    LocationID: '',
    LocationName: '',
    CountryName: '',
    CountryCode: '',
    State: '',
    District: '',
    Taluk: '',
  });

  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryResponse = await axios.get(`http://localhost:5000/inventory/user/${userID}`);
        setInventory(inventoryResponse.data);

        // Fetch locations for dropdown
        const locationsResponse = await axios.get(`http://localhost:5000/storagelocations`);
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, [userID, showAddLocation]);

  const handleCreateInventoryItem = async () => {
    try {
      // Check if the location exists in the locations array
      const locationExists = locations.find((location) => location.LocationID === newInventoryItem.LocationID);

      if (!locationExists) {
        // Location doesn't exist, prompt the user to add it
        setShowAddLocation(true);
        return;
      }

      await axios.post(`http://localhost:5000/inventory/user/${userID}`, newInventoryItem);
      // Refresh inventory data after creating a new item
      const inventoryResponse = await axios.get(`http://localhost:5000/inventory/user/${userID}`);
      setInventory(inventoryResponse.data);
      // Clear the newInventoryItem state
      setNewInventoryItem({
        InventoryID: '',
        LocationID: '',
        CropID: '',
        TotalCapacity: 0,
        OccupiedCapacity: 0,
        UserID: userID,
      });
    } catch (error) {
      console.error('Error creating inventory item:', error);
    }
  };

//   const handleUpdateInventoryItem = async () => {
//     try {
//       await axios.put(`http://localhost:5000/inventory/user/${userID}/${newInventoryItem.InventoryID}`, newInventoryItem);
//       // Refresh inventory data after updating an item
//       const inventoryResponse = await axios.get(`http://localhost:5000/inventory/user/${userID}`);
//       setInventory(inventoryResponse.data);
//       // Clear the newInventoryItem state
//       setNewInventoryItem({
//         InventoryID: '',
//         LocationID: '',
//         CropID: '',
//         TotalCapacity: 0,
//         OccupiedCapacity: 0,
//         UserID: userID,
//       });
//     } catch (error) {
//       console.error('Error updating inventory item:', error);
//     }
//   };

  const handleDeleteInventoryItem = async (inventoryID) => {
    try {
      await axios.delete(`http://localhost:5000/inventory/user/${userID}/${inventoryID}`);
      // Refresh inventory data after deleting an item
      const inventoryResponse = await axios.get(`http://localhost:5000/inventory/user/${userID}`);
      setInventory(inventoryResponse.data);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const handleAddLocation = async () => {
    try {
      // Add the new location to the storage locations table
      await axios.post('http://localhost:5000/storagelocations', newLocation);
      // Refresh locations data after adding a new location
      const locationsResponse = await axios.get(`http://localhost:5000/storagelocations`);
      setLocations(locationsResponse.data);
      // Clear the newLocation state
      setNewLocation({
        LocationID: '',
        LocationName: '',
        CountryName: '',
        CountryCode: '',
        State: '',
        District: '',
        Taluk: '',
      });
      setShowAddLocation(false); // Hide the form after adding the location
    } catch (error) {
      console.error('Error adding new location:', error);
    }
  };

  const handleEditInventoryItem = (item) => {
    // Set the details of the selected inventory item in the form for editing
    setNewInventoryItem({
      InventoryID: item.InventoryID,
      LocationID: item.LocationID,
      CropID: item.CropID,
      TotalCapacity: item.TotalCapacity,
      OccupiedCapacity: item.OccupiedCapacity,
      UserID: userID,
    });
    setIsEditing(true);
  };

  const handleConfirmEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/inventory/user/${userID}/${newInventoryItem.InventoryID}`, newInventoryItem);
      // Refresh inventory data after editing an item
      const inventoryResponse = await axios.get(`http://localhost:5000/inventory/user/${userID}`);
      setInventory(inventoryResponse.data);
      // Clear the newInventoryItem state
      setNewInventoryItem({
        InventoryID: '',
        LocationID: '',
        CropID: '',
        TotalCapacity: 0,
        OccupiedCapacity: 0,
        UserID: userID,
      });
      // Reset the editing state to false
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing inventory item:', error);
    }
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  // Filter inventory based on selected location
  const filteredInventory = selectedLocation
    ? inventory.filter((item) => item.LocationID === selectedLocation)
    : inventory;

  return (
    <div className="inventory-container">
      <h2 className="inventory-title">Inventory</h2>
      <div className="inventory-form">
        <h3 className="form-title">Add/Edit Inventory Item</h3>
        <label className="form-label">
          Inventory ID:
          <input
            type="text"
            value={newInventoryItem.InventoryID}
            className='form-input'
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, InventoryID: e.target.value })}
          />
        </label>
        <br />
        <label className="form-label">
          Location ID:
          <select
            value={newInventoryItem.LocationID}
            className='form-input'
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, LocationID: e.target.value })}
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location.LocationID} value={location.LocationID}>
                {location.LocationID}-{location.LocationName}
              </option>
            ))}
          </select>
        </label>
        <button className="toggle-location-button" onClick={() => setShowAddLocation(!showAddLocation)}>
          {showAddLocation ? 'Hide Location Form' : 'Show Location Form'}
        </button>
        <br />
        <label className="form-label">
          Crop ID:
          <input
            type="text"
            className='form-input'
            value={newInventoryItem.CropID}
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, CropID: e.target.value })}
          />
        </label>
        <br />
        <label className="form-label">
          Total Capacity:
          <input
            type="number"
            min={0}
            className='form-input'
            value={newInventoryItem.TotalCapacity}
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, TotalCapacity: Number(e.target.value) })}
          />
        </label>
        <br />
        <label className="form-label">
          Occupied Capacity:
          <input
            type="number"
            min={0}
            className='form-input'
            value={newInventoryItem.OccupiedCapacity}
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, OccupiedCapacity: Number(e.target.value) })}
          />
        </label>
        <br />
        <button className="form-button" onClick={isEditing ? handleConfirmEdit : handleCreateInventoryItem}>
          {isEditing ? 'Confirm Edit' : 'Add Inventory Item'}
        </button>
      </div>

      {showAddLocation && (
        <div className="location-form">
          <h3 className="form-title">Add/Edit Location</h3>
          <label className="form-label">
            Location ID:
            <input
              type="text"
              className='form-input'
              value={newLocation.LocationID}
              onChange={(e) => setNewLocation({ ...newLocation, LocationID: e.target.value })}
            />
          </label>
          <br />
          <label className="form-label">
            Location Name:
            <input
              type="text"
              className='form-input'
              value={newLocation.LocationName}
              onChange={(e) => setNewLocation({ ...newLocation, LocationName: e.target.value })}
            />
          </label>
          <br />
          <label className="form-label">
            Country Name:
            <input
              type="text"
              className='form-input'
              value={newLocation.CountryName}
              onChange={(e) => setNewLocation({ ...newLocation, CountryName: e.target.value })}
            />
          </label>
          <br />
          <label className="form-label">
            Country Code:
            <input
              type="text"
              className='form-input'
              value={newLocation.CountryCode}
              onChange={(e) => setNewLocation({ ...newLocation, CountryCode: e.target.value })}
            />
          </label>
          <br />
          <label className="form-label">
            State:
            <input
              type="text"
              className='form-input'
              value={newLocation.State}
              onChange={(e) => setNewLocation({ ...newLocation, State: e.target.value })}
            />
          </label>
          <br />
          <label className="form-label">
            District:
            <input
              type="text"
              className='form-input'
              value={newLocation.District}
              onChange={(e) => setNewLocation({ ...newLocation, District: e.target.value })}
            />
          </label>
          <br />
          <label className="form-label">
            Taluk:
            <input
              type="text"
              className='form-input'
              value={newLocation.Taluk}
              onChange={(e) => setNewLocation({ ...newLocation, Taluk: e.target.value })}
            />
          </label>
          <br />
          <button className="form-button" onClick={handleAddLocation}>
            {newLocation.LocationID ? 'Confirm Edit Location' : 'Add Location'}
          </button>
        </div>
      )}

      <div className="inventory-list">
        <h3 className="list-title">Inventory List</h3>
        {/* Dropdown for selecting location */}
        <label className="form-label">
          Select Location:
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="filter-select"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location.LocationID} value={location.LocationID}>
                {location.LocationName}
              </option>
            ))}
          </select>
        </label>

        {/* Display filtered inventory */}
        <table className="inventory-table">
          <thead>
            <tr>
              <th className="table-header">Inventory ID</th>
              <th className="table-header">Location ID</th>
              <th className="table-header">Crop ID</th>
              <th className="table-header">Total Capacity</th>
              <th className="table-header">Occupied Capacity</th>
              <th className="table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.InventoryID} className="table-row">
                <td className="table-cell">{item.InventoryID}</td>
                <td className="table-cell">{item.LocationID}</td>
                <td className="table-cell">{item.CropID}</td>
                <td className="table-cell">{item.TotalCapacity}</td>
                <td className="table-cell">{item.OccupiedCapacity}</td>
                <td className="table-cell">
                  <button className="action-button" onClick={() => handleEditInventoryItem(item)}>Edit</button>
                  <button className="action-button" onClick={() => handleDeleteInventoryItem(item.InventoryID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
