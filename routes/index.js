// EXPRESS
var express = require('express');
var router = express.Router();

// DB
const db = require('../config/database');

/* API ROUTES AND ENDPOINTS */

/*
  GET /
  BASIC API STATUS CHECK
*/
router.get('/', function(req, res, next) {
  res.json({
    status: 'success',
    message: 'Hello World! My API is live.',
    timestamp: new Date()
  });
});

/*
  GET /db-test
  TEST WHETHER THE DATABASE CONNECTION WORKS
*/
router.get('/db-test', async function(req, res, next) {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({
      status: 'Connected',
      math_check: rows[0].result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
