// This file creates a "Pool" of connections so your server can handle multiple users.

// REFERENCE TO ENV VARS
require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,

  ssl: { rejectUnauthorized: false } // Needed for secure cloud connections
});

module.exports = pool;