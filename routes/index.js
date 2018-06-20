var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project 2' });
});

router.get('/main', function(req, res, next) {
  //var io = req.app.get('socket'io);
  var user = "tester_" + Math.floor(Math.random() * (1000000 - 1) + 1000000);
  res.render('main/main', { title: 'Planechat', username: user });
});



module.exports = router;
