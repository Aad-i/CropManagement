const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'mysql@21',
  database: 'cim'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
