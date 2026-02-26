/* OLD PLACEHOLDER CODE */
// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

// IDENTIFIERS AND IMPORTS
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');


/* MAP THE ENDPOINTS */

// GET/READ - stored users
// WEEK 6 - NOW WITH TOKEN CHECKER
router.get('/', authenticateToken, userController.getAllUsers);

// POST/CREATE - created User
router.post('/', userController.createUser);

// GET/READ - user login
router.post('/login', userController.login);

module.exports = router;