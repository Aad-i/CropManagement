import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StorageLocations = () => {
  const { userID } = useParams();
  const [locations, setLocations] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newLocation, setNewLocation] = useState({
    LocationID: '',
    LocationName: '',
    CountryName: '',
    CountryCode: '',
    State: '',
    District: '',
    Taluk: '',
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsResponse = await axios.get(`http://localhost:5000/locations/user/${userID}`);
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [userID]);

  const handleCreateLocation = async () => {
    try {
      await axios.post(`http://localhost:5000/locations/user/${userID}`, newLocation);
      // Refresh locations data after creating a new location
      const locationsResponse = await axios.get(`http://localhost:5000/locations/user/${userID}`);
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
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  const handleEditLocation = (location) => {
    // Set the details of the selected location in the newLocation state for editing
    setNewLocation({
      LocationID: location.LocationID,
      LocationName: location.LocationName,
      CountryName: location.CountryName,
      CountryCode: location.CountryCode,
      State: location.State,
      District: location.District,
      Taluk: location.Taluk,
    });
    setEditMode(true);
  };

  const handleConfirmEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/locations/user/${userID}/${newLocation.LocationID}`, newLocation);
      // Refresh locations data after editing a location
      const locationsResponse = await axios.get(`http://localhost:5000/locations/user/${userID}`);
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
      setEditMode(false);
    } catch (error) {
      console.error('Error editing location:', error);
    }
  };

  const handleDeleteLocation = async (locationID) => {
    try {
      await axios.delete(`http://localhost:5000/locations/user/${userID}/${locationID}`);
      // Refresh locations data after deleting a location
      const locationsResponse = await axios.get(`http://localhost:5000/locations/user/${userID}`);
      setLocations(locationsResponse.data);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div>
      <h2>Storage Locations</h2>
      <div>
        <h3>Create New Location</h3>
        <label>
          Location ID:
          <input
            type="text"
            value={newLocation.LocationID}
            onChange={(e) => setNewLocation({ ...newLocation, LocationID: e.target.value })}
          />
        </label>
        <br />
        <label>
          Location Name:
          <input
            type="text"
            value={newLocation.LocationName}
            onChange={(e) => setNewLocation({ ...newLocation, LocationName: e.target.value })}
          />
        </label>
        <br />
        <label>
          Country Name:
          <input
            type="text"
            value={newLocation.CountryName}
            onChange={(e) => setNewLocation({ ...newLocation, CountryName: e.target.value })}
          />
        </label>
        <br />
        <label>
          Country Code:
          <input
            type="text"
            value={newLocation.CountryCode}
            onChange={(e) => setNewLocation({ ...newLocation, CountryCode: e.target.value })}
          />
        </label>
        <br />
        <label>
          State:
          <input
            type="text"
            value={newLocation.State}
            onChange={(e) => setNewLocation({ ...newLocation, State: e.target.value })}
          />
        </label>
        <br />
        <label>
          District:
          <input
            type="text"
            value={newLocation.District}
            onChange={(e) => setNewLocation({ ...newLocation, District: e.target.value })}
          />
        </label>
        <br />
        <label>
          Taluk:
          <input
            type="text"
            value={newLocation.Taluk}
            onChange={(e) => setNewLocation({ ...newLocation, Taluk: e.target.value })}
          />
        </label>
        <br />
        {editMode ? (
          <button onClick={handleConfirmEdit}>Confirm Edit</button>
        ) : (
          <button onClick={handleCreateLocation}>Add Location</button>
        )}
      </div>

      <div>
        <h3>Storage Locations List</h3>
        <table>
          <thead>
            <tr>
              <th>Location ID</th>
              <th>Location Name</th>
              <th>Country Name</th>
              <th>Country Code</th>
              <th>State</th>
              <th>District</th>
              <th>Taluk</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.LocationID}>
                <td>{location.LocationID}</td>
                <td>{location.LocationName}</td>
                <td>{location.CountryName}</td>
                <td>{location.CountryCode}</td>
                <td>{location.State}</td>
                <td>{location.District}</td>
                <td>{location.Taluk}</td>
                <td>
                  <button onClick={() => handleEditLocation(location)}>Edit</button>
                  <button onClick={() => handleDeleteLocation(location.LocationID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StorageLocations;
