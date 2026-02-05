// EXPRESS

var express = require('express');
var router = express.Router();
const db = require('../config/database');


// API ROUTES TO ENDPOINTS

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    status: 'success',
    message: 'Hello World! My API is live.',
    timestamp: new Date()
  });
});

/* GET db test route */
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

/* GET test_table data */
router.get('/my-data', async function(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM test_table');
    res.json({
      status: 'Success',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;