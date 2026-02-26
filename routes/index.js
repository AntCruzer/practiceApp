// EXPRESS
var express = require('express');
var router = express.Router();

// DB IDENTIFIER
const db = require('../config/database');


/* API ROUTES AND ENDPOINTS */

/* GET home page. */
router.get('/', function(req, res, next) {

  // IN JSON FORMAT, TEXT WILL BE DISPLAYED...
  res.json({
    status: 'success',
    message: 'Hello World! My API is live.',
    timestamp: new Date()
  });
});

/* GET db test route */
router.get('/db-test', async function(req, res, next) {

  // TEST IF SIMPLE SQL CALCULATION QUERY PERFORMS
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

  // TEST IF YOU CAN RETRIEVE DATA IN TEST_TABLE
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