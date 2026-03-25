// IDENTIFIERS AND IMPORTS
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');


/* MAP THE ENDPOINTS */

// GET/READ - stored users (PROTECTED)
router.get('/', authenticateToken, userController.getAllUsers); // WEEK 6 - NOW WITH TOKEN CHECKER

// POST/CREATE - create user (REGISTER)
router.post('/', userController.createUser);

// GET/READ - user login
// router.get('/login', userController.login);

// POST/LOGIN - user login
router.post('/login', userController.login);




/* PHASE 1 ADDITIONS */

// PUT/UPDATE - update user by id (PROTECTED)
router.put('/:id', authenticateToken, userController.updateUser);

// DELETE/REMOVE - delete user by id (PROTECTED)
router.delete('/:id', authenticateToken, userController.deleteUser);
module.exports = router;