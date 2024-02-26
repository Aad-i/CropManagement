import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './EquipmentDetails.scss'

const EquipmentsDetails = () => {
    const { userID } = useParams();
    const [equipments, setEquipments] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [totalQuantityUsedMap, setTotalQuantityUsedMap] = useState({});
    const [selectedInventory, setSelectedInventory] = useState('');

    const [newEquipment, setNewEquipment] = useState({
        EquipmentID: '',
        InventoryID: '',
        EquipmentName: '',
        Quantity: 0,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingEquipmentID, setEditingEquipmentID] = useState(null);

    const fetchEquipments = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/equipments/user/${userID}`);
            setEquipments(response.data);

            // Fetch and set total quantity used for each equipment
            const totalQuantityUsedPromises = response.data.map(async (equipment) => {
                const totalQuantityUsedResponse = await axios.get(`http://localhost:5000/equipments-usage/total/${equipment.EquipmentID}`);
                return { equipmentID: equipment.EquipmentID, totalQuantityUsed: totalQuantityUsedResponse.data.totalQuantityUsed };
            });

            const totalQuantityUsedResults = await Promise.all(totalQuantityUsedPromises);
            const totalQuantityUsedMapResult = totalQuantityUsedResults.reduce((acc, { equipmentID, totalQuantityUsed }) => {
                acc[equipmentID] = totalQuantityUsed;
                return acc;
            }, {});

            setTotalQuantityUsedMap(totalQuantityUsedMapResult);
        } catch (error) {
            console.error('Error fetching equipment details:', error);
        }
    }, [userID, setTotalQuantityUsedMap]);


    useEffect(() => {
        fetchEquipments();
    }, [fetchEquipments]);

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/inventory/user/${userID}`);
                setInventories(response.data);
            } catch (error) {
                console.error('Error fetching inventories:', error);
            }
        };

        fetchInventories();
    }, [userID]);

    const handleAddEquipment = async () => {
        try {
            await axios.post(`http://localhost:5000/equipments/user/${userID}`, newEquipment);
            await fetchEquipments();
            setNewEquipment({
                EquipmentID: '',
                InventoryID: '',
                EquipmentName: '',
                Quantity: 0,
            });
        } catch (error) {
            console.error('Error adding equipment:', error);
        }
    };

    const handleEditEquipment = async (equipmentID) => {
        try {
            const response = await axios.get(`http://localhost:5000/equipments/user/${userID}/${equipmentID}`);
            const editingEquipment = response.data;

            setNewEquipment({
                EquipmentID: editingEquipment.EquipmentID,
                InventoryID: editingEquipment.InventoryID,
                EquipmentName: editingEquipment.EquipmentName,
                Quantity: editingEquipment.Quantity,
            });

            setIsEditing(true);
            setEditingEquipmentID(equipmentID);
        } catch (error) {
            console.error('Error fetching equipment details for editing:', error);
        }
    };


    const handleUpdateEquipment = async () => {
        try {
            // Make a request to confirm the edit
            await axios.put(`http://localhost:5000/equipments/confirm/${userID}/${editingEquipmentID}`, newEquipment);

            // Fetch the updated equipment list
            await fetchEquipments();

            // Reset form and editing state
            setNewEquipment({
                EquipmentID: '',
                InventoryID: '',
                EquipmentName: '',
                Quantity: 0,
            });
            setIsEditing(false);
            setEditingEquipmentID(null);
        } catch (error) {
            console.error('Error confirming equipment edit:', error);
        }
    };

    const handleDeleteEquipment = async (equipmentID) => {
        try {
            await axios.delete(`http://localhost:5000/equipments/user/${userID}/${equipmentID}`);
            await fetchEquipments();
        } catch (error) {
            console.error('Error deleting equipment:', error);
        }
    };

    const handleInventoryChange = (event) => {
        setSelectedInventory(event.target.value);
    };

    // Filter equipment based on selected inventory
    const filteredEquipments = selectedInventory
        ? equipments.filter((equipment) => equipment.InventoryID === selectedInventory)
        : equipments;

    return (
        <div className="all-equipments-container">
            <h2 className="equipments-heading">All Equipments Details</h2>

            {/* Form for adding/editing equipment */}
            <div className="equipment-form">
                <h3 className="form-title">{isEditing ? 'Edit Equipment' : 'Add New Equipment'}</h3>

                <label className="input-label">
                    Equipment ID:
                    <input
                        className="input-field"
                        type="text"
                        value={newEquipment.EquipmentID}
                        onChange={(e) => setNewEquipment({ ...newEquipment, EquipmentID: e.target.value })}
                    />
                </label>
                <br />

                <label className="input-label">
                    Inventory ID:
                    <select
                        className="select-field"
                        value={newEquipment.InventoryID}
                        onChange={(e) => setNewEquipment({ ...newEquipment, InventoryID: e.target.value })}
                    >
                        <option value="">Select Inventory</option>
                        {inventories.map((inventory) => (
                            <option key={inventory.InventoryID} value={inventory.InventoryID}>
                                {inventory.InventoryID}
                            </option>
                        ))}
                    </select>
                </label>
                <br />

                <label className="input-label">
                    Equipment Name:
                    <input
                        className="input-field"
                        type="text"
                        value={newEquipment.EquipmentName}
                        onChange={(e) => setNewEquipment({ ...newEquipment, EquipmentName: e.target.value })}
                    />
                </label>
                <br />

                <label className="input-label">
                    Quantity:
                    <input
                        className="input-field"
                        type="number"
                        value={newEquipment.Quantity}
                        onChange={(e) => setNewEquipment({ ...newEquipment, Quantity: e.target.value })}
                    />
                </label>
                <br />

                {isEditing ? (
                    <>
                        <button className="action-button update-button" onClick={handleUpdateEquipment}>Update Equipment</button>
                        <button className="action-button cancel-button" onClick={() => {
                            setIsEditing(false);
                            setEditingEquipmentID(null);
                            setNewEquipment({
                                EquipmentID: '',
                                InventoryID: '',
                                EquipmentName: '',
                                Quantity: 0,
                            });
                        }}>Cancel</button>
                    </>
                ) : (
                    <button className="action-button add-button" onClick={handleAddEquipment}>Add Equipment</button>
                )}
            </div>

            <div className='equipments-display-table'>
                {/* Dropdown for selecting inventory */}
                <label className="select-label">
                    Select Inventory:
                    <select
                        className="select-filter-inventory"
                        value={selectedInventory}
                        onChange={handleInventoryChange}
                    >
                        <option value="">All Inventories</option>
                        {inventories.map((inventory) => (
                            <option key={inventory.InventoryID} value={inventory.InventoryID}>
                                {inventory.InventoryID}
                            </option>
                        ))}
                    </select>
                </label>

                <table className="equipments-table">
                    <thead>
                        <tr>
                            <th className="table-header">Equipment ID</th>
                            <th className="table-header">Inventory ID</th>
                            <th className="table-header">Equipment Name</th>
                            <th className="table-header">Quantity Used</th>
                            <th className="table-header">Total Quantity</th>
                            <th className="table-header">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEquipments.map((equipment) => (
                            <tr key={equipment.EquipmentID} className='table-row'>
                                <td className="table-cell">{equipment.EquipmentID}</td>
                                <td className="table-cell">{equipment.InventoryID}</td>
                                <td className="table-cell">{equipment.EquipmentName}</td>
                                <td className="table-cell">{totalQuantityUsedMap[equipment.EquipmentID]}</td>
                                <td className="table-cell">{equipment.Quantity}</td>
                                <td className="table-cell">
                                    <button className="action-button edit-button" onClick={() => handleEditEquipment(equipment.EquipmentID)}>Edit</button>
                                    <button className="action-button delete-button" onClick={() => handleDeleteEquipment(equipment.EquipmentID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EquipmentsDetails;
