// IDENTIFIERS AND IMPORTS
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');


module.exports = router;