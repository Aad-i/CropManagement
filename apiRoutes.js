// apiRoutes.js
const express = require('express');
const router = express.Router();  // Define the router here
const pool = require('./db');
const jwt = require('jsonwebtoken'); // Assuming you are using JWT for authentication


// Middleware to parse JSON requests
router.use(express.json());

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

router.get('/users/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const query = `
      SELECT UserName, PhoneNumber, Email
      FROM Users
      WHERE UserID = ?;
    `;

    console.log('Executing Query:', query);

    const [rows] = await pool.query(query, [userID]);

    console.log('Query Results:', rows);

    // Check if user with the specified ID exists
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user details
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// //Define routes for the 'crops' resource
// router.route('/crops')
//   .get(async (req, res) => {
//     try {
//       const [rows] = await pool.query('SELECT * FROM Crops');
//       res.json(rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })
//   .post(async (req, res) => {
//     try {
//       const data = req.body;
//       if (typeof data !== 'object' || Array.isArray(data)) {
//         return res.status(400).json({ error: 'Invalid data' });
//       }
//       const [result] = await pool.query('INSERT INTO Crops SET ?', [data]);
//       res.json({ message: 'POST request for crops', id: result.insertId });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

// // Get a single Crop by ID
// router.get('/crops/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Crops WHERE cropid = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     res.json(result[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update a Crop
// router.put('/crops/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const data = req.body;
//     if (typeof data !== 'object' || Array.isArray(data)) {
//       return res.status(400).json({ error: 'Invalid data' });
//     }
//     await pool.query('UPDATE Crops SET ? WHERE cropid = ?', [data, id]);
//     res.json({ message: 'PUT request for crops' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a Crop
// router.delete('/crops/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Crops WHERE cropid = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     await pool.query('DELETE FROM Crops WHERE cropid = ?', [id]);
//     res.json({ message: `DELETE request for crop with ID ${id}` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Get crops related to a specific user
router.get('/crops/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const { excludeHidden } = req.query;

    let query = 'SELECT * FROM Crops WHERE UserID = ?';
    const values = [userID];

    if (excludeHidden && excludeHidden.toLowerCase() === 'true') {
      query += ' AND IsHidden = FALSE';
    }

    const [crops] = await pool.query(query, values);
    res.json(crops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/crops/:userID/sale', async (req, res) => {
  try {
    const { userID } = req.params;

    console.log('Fetching crops for user ID:', userID);

    const [rows] = await pool.query("SELECT * FROM Crops WHERE UserID = ? AND Purpose = 'Sale'", [userID]);

    console.log('Crops fetched:', rows);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching crops:', error);
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


/*************************************************************************************************/


// Get inventory items related to a specific user
router.get('/inventory/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;

    // Fetch inventory items based on the userID
    const [rows] = await pool.query('SELECT * FROM Inventory WHERE UserID = ?', [userID]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new inventory item for a user
router.post('/inventory/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const data = req.body;

    // Add the userID to the inventory data
    data.UserID = userID;

    // Insert the new inventory item into the database
    const [result] = await pool.query('INSERT INTO Inventory SET ?', [data]);

    res.json({ message: 'Inventory item created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an inventory item for a user
router.put('/inventory/user/:userID/:inventoryID', async (req, res) => {
  try {
    const { userID, inventoryID } = req.params;
    const data = req.body;

    // Update the inventory item in the database
    await pool.query('UPDATE Inventory SET ? WHERE InventoryID = ? AND UserID = ?', [data, inventoryID, userID]);

    res.json({ message: 'Inventory item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an inventory item for a user
router.delete('/inventory/user/:userID/:inventoryID', async (req, res) => {
  try {
    const { userID, inventoryID } = req.params;

    // Delete the inventory item from the database
    await pool.query('DELETE FROM Inventory WHERE InventoryID = ? AND UserID = ?', [inventoryID, userID]);

    res.json({ message: `Inventory item with ID ${inventoryID} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/*************************************************************************************************/


// // Define routes for the 'inventory' resource
// router.route('/inventory')
//   .get(async (req, res) => {
//     try {
//       const [rows] = await pool.query('SELECT * FROM Inventory');
//       res.json(rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })
//   .post(async (req, res) => {
//     try {
//       const data = req.body;
//       if (typeof data !== 'object' || Array.isArray(data)) {
//         return res.status(400).json({ error: 'Invalid data' });
//       }
//       const [result] = await pool.query('INSERT INTO Inventory SET ?', [data]);
//       res.json({ message: 'POST request for inventory', id: result.insertId });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })

// // Get a single Inventory by inventoryid
// router.get('/inventory/:inventoryid', async (req, res) => {
//   try {
//     const { inventoryid } = req.params;
//     if (!inventoryid || isNaN(inventoryid)) {
//       return res.status(400).json({ error: 'Invalid inventoryid' });
//     }
//     const [result] = await pool.query('SELECT * FROM Inventory WHERE inventoryid = ?', [inventoryid]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     res.json(result[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update a Inventory
// router.put('/inventory/:inventoryid', async (req, res) => {
//   try {
//     const { inventoryid } = req.params;
//     if (!inventoryid || isNaN(inventoryid)) {
//       return res.status(400).json({ error: 'Invalid inventoryid' });
//     }
//     const data = req.body;
//     if (typeof data !== 'object' || Array.isArray(data)) {
//       return res.status(400).json({ error: 'Invalid data' });
//     }
//     await pool.query('UPDATE Inventory SET ? WHERE inventoryid = ?', [data, inventoryid]);
//     res.json({ message: 'PUT request for inventory' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a Inventory
// router.delete('/inventory/:inventoryid', async (req, res) => {
//   try {
//     const { inventoryid } = req.params;
//     if (!inventoryid || isNaN(inventoryid)) {
//       return res.status(400).json({ error: 'Invalid inventoryid' });
//     }
//     const [result] = await pool.query('SELECT * FROM Inventory WHERE inventoryid = ?', [inventoryid]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     await pool.query('DELETE FROM Inventory WHERE inventoryid = ?', [inventoryid]);
//     res.json({ message: 'DELETE request for inventory' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


/********************************************************************************* */
// Get transactions related to a specific user
// router.get('/transactions/user/:userID', async (req, res) => {
//   try {
//     const { userID } = req.params;

//     // Fetch transactions based on the userID
//     const [rows] = await pool.query('SELECT * FROM Transactions WHERE UserID = ?', [userID]);

//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Get transactions for a specific user with optional filter
// Get transactions for a specific user with optional filter


router.get('/transactions/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;

    const queryString = `
      SELECT *
      FROM Transactions
      WHERE UserID = ?`;

    const queryParams = [userID];

    const [result] = await pool.query(queryString, queryParams);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Create a new transaction for a user

// router.post('/transactions/user/:userID', async (req, res) => {
//   try {
//     const { userID } = req.params;
//     const data = req.body;

//     // Generate a short transaction ID

//     // Add the transactionID and userID to the transaction data
//     data.UserID = userID;

//     // Insert the new transaction into the database
//     const [result] = await pool.query('INSERT INTO Transactions SET ?', [data]);

//     res.json({ message: 'Transaction created successfully', id: result.insertId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


const short = require('short-uuid');

// Create a translator instance
const translator = short();

router.post('/transactions/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const data = req.body;

    // Generate short UUID with 'T' prefix
    data.TransactionID = 'T' + translator.new();

    // Add the userID to the transaction data
    data.UserID = userID;

    // Insert the new transaction into the database
    const [result] = await pool.query('INSERT INTO Transactions SET ?', [data]);

    res.json({ message: 'Transaction created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete a transaction for a user
router.delete('/transactions/user/:userID/:transactionID', async (req, res) => {
  try {
    const { userID, transactionID } = req.params;

    // Delete the transaction from the database
    await pool.query('DELETE FROM Transactions WHERE TransactionID = ? AND UserID = ?', [transactionID, userID]);

    res.json({ message: `Transaction with ID ${transactionID} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



/********************************************************************************* */


// // Define routes for the 'transactions' resource
// router.route('/transactions')
//   .get(async (req, res) => {
//     try {
//       const [rows] = await pool.query('SELECT * FROM Transactions');
//       res.json(rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })
//   .post(async (req, res) => {
//     try {
//       const data = req.body;
//       if (typeof data !== 'object' || Array.isArray(data)) {
//         return res.status(400).json({ error: 'Invalid data' });
//       }
//       const [result] = await pool.query('INSERT INTO Transactions SET ?', [data]);
//       res.json({ message: 'POST request for transactions', id: result.insertId });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })

// // Get a single Transaction by ID
// router.get('/transactions/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Transactions WHERE TransactionID = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     res.json(result[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update a Transaction
// router.put('/transactions/:id', async (req, res) => {
//   try {
//     const data = req.body;
//     const { id } = req.params;
//     if (!data || !id) {
//       return res.status(400).json({ error: 'Invalid data or ID' });
//     }
//     await pool.query('UPDATE Transactions SET ? WHERE TransactionID = ?', [data, id]);
//     res.json({ message: 'PUT request for transactions' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a Transaction
// router.delete('/transactions/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Transactions WHERE TransactionID = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     await pool.query('DELETE FROM Transactions WHERE TransactionID = ?', [id]);
//     res.json({ message: 'DELETE request for transactions' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Define routes for the 'counterparties' resource
router.post('/counterparties', async (req, res) => {
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

router.get('/counterparties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // if (!id || isNaN(id)) {
    //   return res.status(400).json({ error: 'Invalid ID' });
    // }
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
// router.put('/counterparties/:id', async (req, res) => {
//   try {
//     const data = req.body;
//     const { id } = req.params;
//     if (!data || !id) {
//       return res.status(400).json({ error: 'Invalid data or ID' });
//     }
//     await pool.query('UPDATE Counterparties SET ? WHERE CounterpartyID = ?', [data, id]);
//     res.json({ message: 'PUT request for counterparties' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a Counterparty
// router.delete('/counterparties/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Counterparties WHERE CounterpartyID = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     await pool.query('DELETE FROM Counterparties WHERE CounterpartyID = ?', [id]);
//     res.json({ message: 'DELETE request for counterparties' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// // Define routes for the 'users' resource
// router.route('/users')
//   .get(async (req, res) => {
//     try {
//       const [rows] = await pool.query('SELECT * FROM Users');
//       res.json(rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })
//   .post(async (req, res) => {
//     try {
//       const data = req.body;
//       if (typeof data !== 'object' || Array.isArray(data)) {
//         return res.status(400).json({ error: 'Invalid data' });
//       }
//       const [result] = await pool.query('INSERT INTO Users SET ?', [data]);
//       res.json({ message: 'POST request for users', id: result.insertId });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })

// // Get a single User by ID
// router.get('/users/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Users WHERE UserID = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     res.json(result[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update a User
// router.put('/users/:id', async (req, res) => {
//   try {
//     const data = req.body;
//     const { id } = req.params;
//     if (!data || !id) {
//       return res.status(400).json({ error: 'Invalid data or ID' });
//     }
//     await pool.query('UPDATE Users SET ? WHERE UserID = ?', [data, id]);
//     res.json({ message: 'PUT request for users' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a User
// router.delete('/users/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Users WHERE UserID = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     await pool.query('DELETE FROM Users WHERE UserID = ?', [id]);
//     res.json({ message: 'DELETE request for users' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Define routes for the 'equipments' resource
// router.route('/equipments')
//   .get(async (req, res) => {
//     try {
//       const [rows] = await pool.query('SELECT * FROM Equipments');
//       res.json(rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })
//   .post(async (req, res) => {
//     try {
//       const data = req.body;
//       if (typeof data !== 'object' || Array.isArray(data)) {
//         return res.status(400).json({ error: 'Invalid data' });
//       }
//       const [result] = await pool.query('INSERT INTO Equipments SET ?', [data]);
//       res.json({ message: 'POST request for equipments', id: result.insertId });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })

// // Get a single Equipment by ID
// router.get('/equipments/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Equipments WHERE EquipmentID = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     res.json(result[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update a Equipment
// router.put('/equipments/:id', async (req, res) => {
//   try {
//     const data = req.body;
//     const { id } = req.params;
//     if (!data || !id) {
//       return res.status(400).json({ error: 'Invalid data or ID' });
//     }
//     await pool.query('UPDATE Equipments SET ? WHERE EquipmentID = ?', [data, id]);
//     res.json({ message: 'PUT request for equipments' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a Equipment
// router.delete('/equipments/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Equipments WHERE EquipmentID = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     await pool.query('DELETE FROM Equipments WHERE EquipmentID = ?', [id]);
//     res.json({ message: 'DELETE request for equipments' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

/********************************************************************************************************************* */
// Get equipment items related to a specific user
router.get('/equipments/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;

    // Fetch equipment items based on the userID
    const [rows] = await pool.query('SELECT * FROM Equipments WHERE UserID = ?', [userID]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single equipment item for editing
router.get('/equipments/user/:userID/:equipmentID', async (req, res) => {
  try {
    const { userID, equipmentID } = req.params;

    // Fetch the equipment item based on userID and equipmentID
    const [equipment] = await pool.query('SELECT * FROM Equipments WHERE UserID = ? AND EquipmentID = ?', [userID, equipmentID]);

    // Check if equipment exists
    if (equipment.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Send the equipment details as JSON response
    res.json(equipment[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new equipment item for a user
router.post('/equipments/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const data = req.body;

    // Add the userID to the equipment data
    data.UserID = userID;

    // Insert the new equipment item into the database
    const [result] = await pool.query('INSERT INTO Equipments SET ?', [data]);

    res.json({ message: 'Equipment item created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an equipment item for a user
// Confirm and update equipment details for a specific user and equipment ID
router.put('/equipments/confirm/:userID/:equipmentID', async (req, res) => {
  try {
    const { userID, equipmentID } = req.params;
    const updatedData = req.body;

    // Check if the equipment exists
    const [existingEquipment] = await pool.query('SELECT * FROM Equipments WHERE UserID = ? AND EquipmentID = ?', [userID, equipmentID]);

    if (existingEquipment.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Update the equipment details
    await pool.query('UPDATE Equipments SET ? WHERE UserID = ? AND EquipmentID = ?', [updatedData, userID, equipmentID]);

    res.json({ message: 'Equipment details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an equipment item for a user
router.delete('/equipments/user/:userID/:equipmentID', async (req, res) => {
  try {
    const { userID, equipmentID } = req.params;

    // Delete the equipment item from the database
    await pool.query('DELETE FROM Equipments WHERE EquipmentID = ? AND UserID = ?', [equipmentID, userID]);

    res.json({ message: `Equipment item with ID ${equipmentID} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/******************************************************************************************************************************************************market itemssssss */

// Get market items
router.get('/market-items/user/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const query = `
      SELECT mi.ItemID, mi.SellerID, mi.Price, c.CropName, c.TotalYield, c.Quality
      FROM MarketItems mi
      JOIN Crops c ON mi.ItemID = c.CropID
      WHERE mi.SellerID != ? AND c.IsHidden = 0;
    `;

    console.log('Executing Query:', query);

    const [rows] = await pool.query(query, [userID]);

    console.log('Query Results:', rows);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/market-items/user/belongs/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const query = `
      SELECT mi.ItemID, mi.SellerID, mi.Price, c.CropName, c.TotalYield, c.Quality
      FROM MarketItems mi
      JOIN Crops c ON mi.ItemID = c.CropID
      WHERE mi.SellerID = ?;
    `;

    console.log('Executing Query:', query);

    const [rows] = await pool.query(query, [userID]);

    console.log('Query Results:', rows);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post('/market-items', async (req, res) => {
  try {
    const { itemID, sellerID, price } = req.body;

    // Check if the item already exists in the MarketItems table
    const [existingItem] = await pool.query('SELECT * FROM MarketItems WHERE ItemID = ? AND SellerID = ?', [itemID, sellerID]);

    if (existingItem.length > 0) {
      return res.status(400).json({ error: 'Item already exists in the market.' });
    }

    // Insert the new item into the MarketItems table
    await pool.query('INSERT INTO MarketItems (ItemID, SellerID, Price) VALUES (?, ?, ?)', [itemID, sellerID, price]);

    res.json({ message: 'Item added to the market successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/market-items/:cropID/:sellerID', async (req, res) => {
  try {
    const { cropID, sellerID } = req.params;

    // Query the MarketItems table to check if the item exists
    const [rows] = await pool.query('SELECT * FROM MarketItems WHERE ItemID = ? AND SellerID = ?', [cropID, sellerID]);

    // Return the result to the client
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/********************************************************************************************************************* **********************************/

// // Define routes for the 'equipmentUsage' resource
// router.route('/equipmentUsage')
//   .get(async (req, res) => {
//     try {
//       const [rows] = await pool.query('SELECT * FROM EquipmentUsage');
//       res.json(rows);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })
//   .post(async (req, res) => {
//     try {
//       const data = req.body;
//       if (typeof data !== 'object' || Array.isArray(data)) {
//         return res.status(400).json({ error: 'Invalid data' });
//       }
//       const [result] = await pool.query('INSERT INTO EquipmentUsage SET ?', [data]);
//       res.json({ message: 'POST request for equipmentUsage', id: result.insertId });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   })

// // Get a single EquipmentUsage by EquipmentID and UsageDate
// router.get('/equipmentUsage/:EquipmentID/:UsageDate', async (req, res) => {
//   try {
//     const { EquipmentID, UsageDate } = req.params;
//     if (!EquipmentID || !UsageDate || isNaN(EquipmentID)) {
//       return res.status(400).json({ error: 'Invalid EquipmentID or UsageDate' });
//     }
//     const [result] = await pool.query('SELECT * FROM EquipmentUsage WHERE EquipmentID = ? AND UsageDate = ?', [EquipmentID, UsageDate]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     res.json(result[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update a EquipmentUsage
// router.put('/equipmentUsage/:EquipmentID/:UsageDate', async (req, res) => {
//   try {
//     const data = req.body;
//     const { EquipmentID, UsageDate } = req.params;
//     if (!data || !EquipmentID || !UsageDate || isNaN(EquipmentID)) {
//       return res.status(400).json({ error: 'Invalid data or EquipmentID or UsageDate' });
//     }
//     await pool.query('UPDATE EquipmentUsage SET ? WHERE EquipmentID = ? AND UsageDate = ?', [data, EquipmentID, UsageDate]);
//     res.json({ message: 'PUT request for equipmentUsage' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a EquipmentUsage
// router.delete('/equipmentUsage/:EquipmentID/:UsageDate', async (req, res) => {
//   try {
//     const { EquipmentID, UsageDate } = req.params;
//     if (!EquipmentID || !UsageDate || isNaN(EquipmentID)) {
//       return res.status(400).json({ error: 'Invalid EquipmentID or UsageDate' });
//     }
//     const [result] = await pool.query('SELECT * FROM EquipmentUsage WHERE EquipmentID = ? AND UsageDate = ?', [EquipmentID, UsageDate]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     await pool.query('DELETE FROM EquipmentUsage WHERE EquipmentID = ? AND UsageDate = ?', [EquipmentID, UsageDate]);
//     res.json({ message: 'DELETE request for equipmentUsage' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

/*************************************************************************************************** */
// Get all equipment details for a specific user
router.get('/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const [rows] = await pool.query('SELECT * FROM Equipments WHERE UserID = ?', [userID]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// There is an error here which is "Equipment not found", it is considering it for all the route ids **************************************************************

// Get details of a specific equipment
router.get('/:equipmentID', async (req, res) => {
  try {
    const { equipmentID } = req.params;
    const [rows] = await pool.query('SELECT * FROM Equipments WHERE EquipmentID = ?', [equipmentID]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new equipment for a user
router.post('/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const data = req.body;
    data.UserID = userID;
    const [result] = await pool.query('INSERT INTO Equipments SET ?', [data]);
    res.json({ message: 'Equipment created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing equipment
router.put('/:equipmentID', async (req, res) => {
  try {
    const { equipmentID } = req.params;
    const data = req.body;
    await pool.query('UPDATE Equipments SET ? WHERE EquipmentID = ?', [data, equipmentID]);
    res.json({ message: 'Equipment updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an equipment
router.delete('/:equipmentID', async (req, res) => {
  try {
    const { equipmentID } = req.params;
    await pool.query('DELETE FROM Equipments WHERE EquipmentID = ?', [equipmentID]);
    res.json({ message: `Equipment with ID ${equipmentID} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/************************************************************************************************* */
// Get equipment usage items related to a specific user
router.get('/equipments-usage/user/:userID', async (req, res) => {
  const userID = req.params.userID;

  try {
    const result = await pool.query(
      'SELECT * FROM equipmentusage WHERE EquipmentID IN (SELECT EquipmentID FROM equipments WHERE UserID = ?)',
      [userID]
    );

    res.json(result[0]); // Assuming the result is an array of equipment usage items
  } catch (error) {
    console.error('Error fetching equipment usage:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get equipment usage items and details related to a specific user
// Get equipment usage details with related equipment information for a specific user

// Create a new equipment usage item for a user
router.post('/equipments-usage/user/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const data = req.body;

    // Add the userID to the equipment usage data
    data.UserID = userID;

    // Insert the new equipment usage item into the database
    const [result] = await pool.query('INSERT INTO EquipmentUsage SET ?', [data]);

    res.json({ message: 'Equipment usage item created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an equipment usage item for a user
router.put('/equipments-usage/user/:userID/:equipmentID/:usageDate', async (req, res) => {
  try {
    const { userID, equipmentID, usageDate } = req.params;
    const data = req.body;

    // Update the equipment usage item in the database
    await pool.query('UPDATE EquipmentUsage SET ? WHERE EquipmentID = ? AND UsageDate = ? AND UserID = ?', [data, equipmentID, usageDate, userID]);

    res.json({ message: 'Equipment usage item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an equipment usage item for a user
router.delete('/equipments-usage/user/:userID/:equipmentID/:usageDate', async (req, res) => {
  try {
    const { userID, equipmentID, usageDate } = req.params;

    // Delete the equipment usage item from the database
    await pool.query('DELETE FROM EquipmentUsage WHERE EquipmentID = ? AND UsageDate = ? AND UserID = ?', [equipmentID, usageDate, userID]);

    res.json({ message: `Equipment usage item with ID ${equipmentID} and Usage Date ${usageDate} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/equipments-usage/total/:equipmentID', async (req, res) => {
  try {
    const { equipmentID } = req.params;
    const [result] = await pool.query('SELECT SUM(QuantityUsed) AS totalQuantityUsed FROM EquipmentUsage WHERE EquipmentID = ?', [equipmentID]);
    const totalQuantityUsed = result[0].totalQuantityUsed || 0;
    res.json({ totalQuantityUsed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/********************************************************************************************************************* */

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
// .post(async (req, res) => {
//   try {
//     const data = req.body;
//     if (typeof data !== 'object' || Array.isArray(data)) {
//       return res.status(400).json({ error: 'Invalid data' });
//     }
//     const [result] = await pool.query('INSERT INTO Workers SET ?', [data]);
//     res.json({ message: 'POST request for workers', id: result.insertId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// })



// Get a single Worker by ID
router.get('/workers/:workerid', async (req, res) => {
  try {
    const { workerid } = req.params;

    // Validate if the ID is a valid number
    // if (isNaN(workerid)) {
    //   return res.status(400).json({ error: 'Invalid ID' });
    // }

    // Fetch worker details based on the WorkerID
    const [result] = await pool.query('SELECT * FROM Workers WHERE WorkerID = ?', [workerid]);

    // Check if a worker with the given ID exists
    if (result.length === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Return the worker details
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// // Update a Worker
// router.put('/workers/:id', async (req, res) => {
//   try {
//     const data = req.body;
//     const { id } = req.params;
//     if (!data || !id) {
//       return res.status(400).json({ error: 'Invalid data or ID' });
//     }
//     await pool.query('UPDATE Workers SET ? WHERE WorkerID = ?', [data, id]);
//     res.json({ message: 'PUT request for workers' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a Worker
// router.delete('/workers/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: 'Invalid ID' });
//     }
//     const [result] = await pool.query('SELECT * FROM Workers WHERE WorkerID = ?', [id]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: 'Record not found' });
//     }
//     await pool.query('DELETE FROM Workers WHERE WorkerID = ?', [id]);
//     res.json({ message: 'DELETE request for workers' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



module.exports = router;
