const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const userController = require('./userController');
const apiRoutes = require('./apiRoutes');

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors()); 

//userController for authentication routes
app.use('/', userController);
app.use('/', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
