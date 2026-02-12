// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Map the endpoints
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

module.exports = router;