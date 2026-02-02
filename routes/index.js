// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render() is for Websites (HTML)
  // res.json() is for APIs (Data)
  res.json({
    status: 'success',
    message: 'Hello World! My API is live.',
    timestamp: new Date()
  });
});

module.exports = router;