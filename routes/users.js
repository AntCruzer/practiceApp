const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

/*
  GET /api/users
  GET ALL USERS
  PROTECTED ROUTE
*/
router.get('/', authenticateToken, userController.getAllUsers);

/*
  PUT /api/users/:id
  UPDATE USER BY ID
  PROTECTED ROUTE
*/
router.put('/:id', authenticateToken, userController.updateUser);

/*
  DELETE /api/users/:id
  DELETE USER BY ID
  PROTECTED ROUTE
*/
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;

