var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('./local_modules/mon-mid');
var helmet = require('helmet');
var expressSession = require('express-session');
var session = expressSession({
  key: 'user_sid',
  secret: "planechat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, //can't get https to work
    httpOnly: true,
    expires: 60000 * 60 * 24 * 30 * 3 //3 months
    // maxAge: 60000 * 60 * 24 * 30 * 3 
  }
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var assignmentsRouter = require('./routes/assignments');
var magicRouter = require('./routes/magic');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//security
app.use(helmet({
  frameguard: {
    action: "deny"
  }
}));
app.use(session);

//socket io stuffs
app.set('socketio', io);
io.set('authorization', function (handshake, accept) {
  session(handshake, {}, function (err) {
    if (err) {
      return accept(err);
    } else {
      var sesh = handshake.session;

      accept(null, sesh.user != null);
    }
  });
});

//utilities
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/assignments', assignmentsRouter);
app.use('/magic', magicRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/************************************************************************************
* Socket Listeners
*************************************************************************************/
io.sockets.on('connection', function (socket) {
  console.log("user connected");

  checkForActiveCorpses();

  session(socket.handshake, {}, function (err) {
    if (err) {
      console.log("Error on connection");
      console.log(err);
    } else {
      var sesh = socket.handshake.session;

      socket.on('chat', function (model) {
        if (sesh.user) {
          model.from_user = sesh.user;

          mongoose.insertMessage(model, function (response, didInsert, messageModel) {
            if (!didInsert || response.insertedCount < 1) {
              //TODO: alert user that message text was invalid
              console.log(response);
            } else {
              io.emit('newChat', messageModel);
            }
          });
        }        
      });

      socket.on('userLoaded', function () {
        if (sesh.user) {
          var model = {
            user: sesh.user,
            socketId: socket.id
          }

          mongoose.insertActiveUser(model, function (response, didInsert) {
            if (didInsert) {
              io.emit('userConn', sesh.user);
            } else {
              console.log("Active user could not be inserted");
              console.log(response);
            }
          });
        }
      });

      socket.on('disconnect', function () {
        console.log("user disconnected");
        if (sesh.user) {
          mongoose.deleteActiveUser(sesh.user, function (err) {
            if (err) {
              console.log("Active user could not be deleted");
              console.log(err);
            } else {
              io.emit('userDisc', sesh.user);
            }
          });
        }
      });
    }
  });
});

/*
* this will help, but I should really find a better way to delete 
* the active user, like when the tab/browser closes or something
*/
function checkForActiveCorpses() {
  mongoose.getActiveUsers(function (err, docs) {
    if (err) {
      console.log("ERROR: Problem checking for corpses:");
      console.log(err);
      return;
    } else {
      for (var i = 0; i < docs.length; i++) {
        if (io.sockets.sockets[docs[i].socketId] == undefined) {
          var user = docs[i].username;
          mongoose.deleteActiveUser(user, function (err) {
            if (err) {
              console.log("Active user could not be deleted");
              console.log(err);
            } else {
              io.emit('userDisc', user);
            }
          });
        }
      }
    }
  });
}

module.exports = { app: app, server: server };