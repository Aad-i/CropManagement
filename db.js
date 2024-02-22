// db.js

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'mysql@21',
  database: 'dbmsproject'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
