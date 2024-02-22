// apiRoutes.js
const express = require('express');
const router = express.Router();  // Define the router here
const pool = require('./db');
const jwt = require('jsonwebtoken'); // Assuming you are using JWT for authentication

// Middleware to parse JSON requests
router.use(express.json());

// // Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) return res.status(401).json({ error: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, 'development');
//     req.user = decoded.userId;
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ error: 'Token is not valid' });
//   }
// };

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Received Token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token missing' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'development');
    console.log('Decoded Token:', decoded);
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};


// Protected route
router.get('/user/dashboard', verifyToken, async (req, res) => {
  try {
    // Access the authenticated user information from req.user
    const userId = req.user;

    // Fetch user-specific dashboard data using the user ID
    const [userData] = await pool.query('SELECT * FROM Users WHERE userid = ?', [userId]);

    // Check if user data exists
    if (userData.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user-specific dashboard data
    res.json(userData[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define routes for the 'crops' resource
router.route('/crops')
  .get(async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Crops');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      if (typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data' });
      }
      const [result] = await pool.query('INSERT INTO Crops SET ?', [data]);
      res.json({ message: 'POST request for crops', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Get a single Crop by ID
router.get('/crops/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Crops WHERE cropid = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a Crop
router.put('/crops/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const data = req.body;
    if (typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    await pool.query('UPDATE Crops SET ? WHERE cropid = ?', [data, id]);
    res.json({ message: 'PUT request for crops' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a Crop
router.delete('/crops/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Crops WHERE cropid = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    await pool.query('DELETE FROM Crops WHERE cropid = ?', [id]);
    res.json({ message: `DELETE request for crop with ID ${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get crops related to a specific user
router.get('/crops/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;

    // Fetch crops based on the userID
    const [rows] = await pool.query('SELECT * FROM Crops WHERE UserID = ?', [userID]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new crop for a user
router.post('/crops/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const data = req.body;

    // Add the userID to the crop data
    data.UserID = userID;

    // Insert the new crop into the database
    const [result] = await pool.query('INSERT INTO Crops SET ?', [data]);

    res.json({ message: 'Crop created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a crop for a user
router.put('/crops/user/:userID/:cropID', async (req, res) => {
  try {
    const { userID, cropID } = req.params;
    const data = req.body;

    // Update the crop in the database
    await pool.query('UPDATE Crops SET ? WHERE CropID = ? AND UserID = ?', [data, cropID, userID]);

    res.json({ message: 'Crop updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a crop for a user
router.delete('/crops/user/:userID/:cropID', async (req, res) => {
  try {
    const { userID, cropID } = req.params;

    // Delete the crop from the database
    await pool.query('DELETE FROM Crops WHERE CropID = ? AND UserID = ?', [cropID, userID]);

    res.json({ message: `Crop with ID ${cropID} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get all StorageLocations
router.get('/storagelocations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM StorageLocations');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single StorageLocation by ID
router.get('/storagelocations/:id/', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM StorageLocations WHERE LocationID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new StorageLocation
router.post('/storagelocations', async (req, res) => {
  try {
    const data = req.body;
    if (typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    const [result] = await pool.query('INSERT INTO StorageLocations SET ?', [data]);
    res.json({ message: 'POST request for StorageLocations', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a StorageLocation
router.put('/storagelocations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const data = req.body;
    if (typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    await pool.query('UPDATE StorageLocations SET ? WHERE LocationID = ?', [data, id]);
    res.json({ message: 'PUT request for StorageLocations' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a StorageLocation
router.delete('/storagelocations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM StorageLocations WHERE LocationID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    await pool.query('DELETE FROM StorageLocations WHERE LocationID = ?', [id]);
    res.json({ message: 'DELETE request for StorageLocations' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Define routes for the 'inventory' resource
router.route('/inventory')
  .get(async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Inventory');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      if (typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data' });
      }
      const [result] = await pool.query('INSERT INTO Inventory SET ?', [data]);
      res.json({ message: 'POST request for inventory', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

// Get a single Inventory by inventoryid
router.get('/inventory/:inventoryid', async (req, res) => {
  try {
    const { inventoryid } = req.params;
    if (!inventoryid || isNaN(inventoryid)) {
      return res.status(400).json({ error: 'Invalid inventoryid' });
    }
    const [result] = await pool.query('SELECT * FROM Inventory WHERE inventoryid = ?', [inventoryid]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a Inventory
router.put('/inventory/:inventoryid', async (req, res) => {
  try {
    const { inventoryid } = req.params;
    if (!inventoryid || isNaN(inventoryid)) {
      return res.status(400).json({ error: 'Invalid inventoryid' });
    }
    const data = req.body;
    if (typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    await pool.query('UPDATE Inventory SET ? WHERE inventoryid = ?', [data, inventoryid]);
    res.json({ message: 'PUT request for inventory' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a Inventory
router.delete('/inventory/:inventoryid', async (req, res) => {
  try {
    const { inventoryid } = req.params;
    if (!inventoryid || isNaN(inventoryid)) {
      return res.status(400).json({ error: 'Invalid inventoryid' });
    }
    const [result] = await pool.query('SELECT * FROM Inventory WHERE inventoryid = ?', [inventoryid]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    await pool.query('DELETE FROM Inventory WHERE inventoryid = ?', [inventoryid]);
    res.json({ message: 'DELETE request for inventory' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Define routes for the 'transactions' resource
router.route('/transactions')
  .get(async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Transactions');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      if (typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data' });
      }
      const [result] = await pool.query('INSERT INTO Transactions SET ?', [data]);
      res.json({ message: 'POST request for transactions', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

// Get a single Transaction by ID
router.get('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Transactions WHERE TransactionID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a Transaction
router.put('/transactions/:id', async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    if (!data || !id) {
      return res.status(400).json({ error: 'Invalid data or ID' });
    }
    await pool.query('UPDATE Transactions SET ? WHERE TransactionID = ?', [data, id]);
    res.json({ message: 'PUT request for transactions' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a Transaction
router.delete('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Transactions WHERE TransactionID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    await pool.query('DELETE FROM Transactions WHERE TransactionID = ?', [id]);
    res.json({ message: 'DELETE request for transactions' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define routes for the 'counterparties' resource
router.route('/counterparties')
  .get(async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Counterparties');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      if (typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data' });
      }
      const [result] = await pool.query('INSERT INTO Counterparties SET ?', [data]);
      res.json({ message: 'POST request for counterparties', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

// Get a single Counterparty by ID
router.get('/counterparties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Counterparties WHERE CounterpartyID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a Counterparty
router.put('/counterparties/:id', async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    if (!data || !id) {
      return res.status(400).json({ error: 'Invalid data or ID' });
    }
    await pool.query('UPDATE Counterparties SET ? WHERE CounterpartyID = ?', [data, id]);
    res.json({ message: 'PUT request for counterparties' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a Counterparty
router.delete('/counterparties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Counterparties WHERE CounterpartyID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    await pool.query('DELETE FROM Counterparties WHERE CounterpartyID = ?', [id]);
    res.json({ message: 'DELETE request for counterparties' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Define routes for the 'users' resource
router.route('/users')
  .get(async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Users');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      if (typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data' });
      }
      const [result] = await pool.query('INSERT INTO Users SET ?', [data]);
      res.json({ message: 'POST request for users', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

// Get a single User by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Users WHERE UserID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a User
router.put('/users/:id', async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    if (!data || !id) {
      return res.status(400).json({ error: 'Invalid data or ID' });
    }
    await pool.query('UPDATE Users SET ? WHERE UserID = ?', [data, id]);
    res.json({ message: 'PUT request for users' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a User
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Users WHERE UserID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    await pool.query('DELETE FROM Users WHERE UserID = ?', [id]);
    res.json({ message: 'DELETE request for users' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define routes for the 'equipments' resource
router.route('/equipments')
  .get(async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Equipments');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      if (typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data' });
      }
      const [result] = await pool.query('INSERT INTO Equipments SET ?', [data]);
      res.json({ message: 'POST request for equipments', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

// Get a single Equipment by ID
router.get('/equipments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Equipments WHERE EquipmentID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a Equipment
router.put('/equipments/:id', async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    if (!data || !id) {
      return res.status(400).json({ error: 'Invalid data or ID' });
    }
    await pool.query('UPDATE Equipments SET ? WHERE EquipmentID = ?', [data, id]);
    res.json({ message: 'PUT request for equipments' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a Equipment
router.delete('/equipments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Equipments WHERE EquipmentID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    await pool.query('DELETE FROM Equipments WHERE EquipmentID = ?', [id]);
    res.json({ message: 'DELETE request for equipments' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Define routes for the 'equipmentUsage' resource
router.route('/equipmentUsage')
  .get(async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM EquipmentUsage');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      if (typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data' });
      }
      const [result] = await pool.query('INSERT INTO EquipmentUsage SET ?', [data]);
      res.json({ message: 'POST request for equipmentUsage', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

// Get a single EquipmentUsage by EquipmentID and UsageDate
router.get('/equipmentUsage/:EquipmentID/:UsageDate', async (req, res) => {
  try {
    const { EquipmentID, UsageDate } = req.params;
    if (!EquipmentID || !UsageDate || isNaN(EquipmentID)) {
      return res.status(400).json({ error: 'Invalid EquipmentID or UsageDate' });
    }
    const [result] = await pool.query('SELECT * FROM EquipmentUsage WHERE EquipmentID = ? AND UsageDate = ?', [EquipmentID, UsageDate]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a EquipmentUsage
router.put('/equipmentUsage/:EquipmentID/:UsageDate', async (req, res) => {
  try {
    const data = req.body;
    const { EquipmentID, UsageDate } = req.params;
    if (!data || !EquipmentID || !UsageDate || isNaN(EquipmentID)) {
      return res.status(400).json({ error: 'Invalid data or EquipmentID or UsageDate' });
    }
    await pool.query('UPDATE EquipmentUsage SET ? WHERE EquipmentID = ? AND UsageDate = ?', [data, EquipmentID, UsageDate]);
    res.json({ message: 'PUT request for equipmentUsage' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a EquipmentUsage
router.delete('/equipmentUsage/:EquipmentID/:UsageDate', async (req, res) => {
  try {
    const { EquipmentID, UsageDate } = req.params;
    if (!EquipmentID || !UsageDate || isNaN(EquipmentID)) {
      return res.status(400).json({ error: 'Invalid EquipmentID or UsageDate' });
    }
    const [result] = await pool.query('SELECT * FROM EquipmentUsage WHERE EquipmentID = ? AND UsageDate = ?', [EquipmentID, UsageDate]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    await pool.query('DELETE FROM EquipmentUsage WHERE EquipmentID = ? AND UsageDate = ?', [EquipmentID, UsageDate]);
    res.json({ message: 'DELETE request for equipmentUsage' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define routes for the 'workers' resource
router.route('/workers')
  .get(async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Workers');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      if (typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data' });
      }
      const [result] = await pool.query('INSERT INTO Workers SET ?', [data]);
      res.json({ message: 'POST request for workers', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

// Get a single Worker by ID
router.get('/workers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Workers WHERE WorkerID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a Worker
router.put('/workers/:id', async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    if (!data || !id) {
      return res.status(400).json({ error: 'Invalid data or ID' });
    }
    await pool.query('UPDATE Workers SET ? WHERE WorkerID = ?', [data, id]);
    res.json({ message: 'PUT request for workers' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a Worker
router.delete('/workers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const [result] = await pool.query('SELECT * FROM Workers WHERE WorkerID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    await pool.query('DELETE FROM Workers WHERE WorkerID = ?', [id]);
    res.json({ message: 'DELETE request for workers' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
