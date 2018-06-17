var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project 2' });
});

router.get('/main', function(req, res, next) {
  //var io = req.app.get('socket'io);
  res.render('main', { title: 'Planechat' });
});



module.exports = router;
