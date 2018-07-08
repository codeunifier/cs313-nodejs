var express = require('express');
var router = express.Router();

var mongoose = require('../local_modules/mon-mid');

mongoose.attemptConnection(function (err) {
  console.log(err.name + ": " + err.message);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project 2' });
});

function auth(req, res, next) {
  if (req.session) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  } else {
    res.sendStatus(403);//forbidden
  }
}

router.get('/main', auth, function(req, res, next) {
  res.render('main/main', { title: 'Planechat', username: req.session.user });
});

router.get('/error', function (req, res, next) {
  res.redirect('/login');
});

router.get('/login', function (req, res, next) {
  res.render('main/login', { message: req.errMsg });
});

router.get('/logout', function (req, res, next) {
  var user = req.session.user;
  req.session.user = null;

  mongoose.deleteActiveUser(user, function (err) {
    if (err) {
      console.log("Active user could not be deleted");
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});


/****************************************************
 * AJAX CALLS
 * *************************************************/

router.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  mongoose.validateUserCredentials(username, password, function(err, isValid) {
    if (err) {
      res.status(500).send({error: err});
    } else if (isValid) {
      req.session.user = username;
      res.status(200).send(JSON.stringify({ data: true }));
    } else {
      res.status(200).send({error: "Username / password invalid"});
    }
  });
});

router.post('/newAccount', function (req, res) {
  var model = {
    username: req.body.username,
    password: req.body.pass
  };

  mongoose.insertNewUser(model, function (response, didInsert) {
    if (!didInsert) {
      res.status(500).send(response);
    } else {
      req.session.user = model.username;
      res.status(200).send(JSON.stringify({data: true}));
    }
  });
});

router.get('/conversation', auth, function (req, res, next) {
  mongoose.getConversation(function (err, data) {
    if (err == null) {
      res.status(200).send(JSON.stringify(data));
    } else {
      res.status(500).send(err);
    }
  });
});

router.get('/activeusers', auth, function (req, res, next) {
  mongoose.getActiveUsers(function (err, data) {
    if (err == null) {
      res.status(200).send(JSON.stringify(data));
    } else {
      res.status(500).send(err);
    }
  });
});

module.exports = router;

//export functions for testing
module.exports.auth = auth;