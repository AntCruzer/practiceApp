const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

/*
  POST /api/auth/register
  REGISTER A NEW USER
*/
router.post('/register', userController.createUser);

/*
  POST /api/auth/login
  LOG IN AN EXISTING USER
*/
router.post('/login', userController.login);

module.exports = router;