var express = require('express');
var router = express.Router();
var ssn;

var mongoose = require('../local_modules/mon-mid');

//models
var LoginCookie = require('../models/login-cookie-model');

mongoose.attemptConnection(function (err) {
  console.log(err.name + ": " + err.message);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project 2' });
});

function auth(req, res, next) {
  var cookie = req.cookies.pc_login;

  if (ssn) {
    if (req.session && ssn.username == cookie) {
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.redirect('/login');
  }
}

router.get('/main', auth, function(req, res, next) {
  res.render('main/main', { title: 'Planechat', username: ssn.username });
});

router.get('/error', function (req, res, next) {
  res.redirect('/login');
});

router.get('/login', function (req, res, next) {
  res.render('main/login', { message: req.errMsg });
});


/****************************************************
 * AJAX CALLS
 * *************************************************/

router.post('/login', function (req, res) {
  ssn = req.session;

  var username = req.body.username;
  var password = req.body.password;

  mongoose.validateUser(username, password, function(err, isValid) {
    if (err) {
      res.status(400);
      res.send({error: err});
    } else if (isValid) {
      //TODO: check if user is already logged in
      //TODO: set up active_users collection
      
      var exp = new Date();
      exp.setFullYear(exp.getFullYear() + 1);
  
      ssn.username = username;
      res.cookie("pc_login", username);
      res.status(200);
      res.send(JSON.stringify({ data: true }));
    } else {
      res.status(200);
      res.send({error: "Username / password invalid"});
    }
  });
});

router.post('/newAccount', function (req, res) {
  ssn = req.session;

  var model = {
    username: req.body.username,
    password: req.body.pass
  };

  mongoose.insertNewUser(model, function (response, didInsert) {
    if (!didInsert) {
      res.status(200);
      res.send(null);
    } else {
      var expiration = new Date();
      expiration.setFullYear(expiration.getFullYear() + 1);

      ssn.username = model.username;
      res.cookie("pc_login", model.username);
      res.status(200);
      res.send(JSON.stringify({data: true}));
    }
  });
});

module.exports = router;
