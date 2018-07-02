var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('./local_modules/mon-mid');
var helmet = require('helmet');
var session = require('express-session');
var fs = require('fs');

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
app.use(session({
  key: 'user_sid',
  secret: "planechat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, //can't get https to work
    httpOnly: true,
    expires: 60000 * 60 * 24 * 30 * 3
    // maxAge: 60000 * 60 * 24 * 30 * 3 //3 months
  }
}));

//set socket io
app.set('socketio', io)

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

io.sockets.on('connection', function (socket) {
  var user = null;

  console.log('user connected');

  socket.on('chat', function (model) {
    mongoose.insertMessage(model, function (response, didInsert, messageModel) {
      if (!didInsert || response.insertedCount < 1) {
        //TODO: alert user that message text was invalid
      } else {
        io.emit('newChat', messageModel);
      }
    });
  });

  socket.on('userLoaded', function (username) {
    mongoose.insertActiveUser(username, function (response, didInsert) {
      if (didInsert) {
        user = username;
        io.emit('userConn', username);
      } else {
        console.log("Active user could not be inserted");
        console.log(response);
      }
    });
  });

  socket.on('disconnect', function () {
    console.log("user disconnected");
    if (user) {
      mongoose.deleteActiveUser(user, function (err) {
        if (err) {
          console.log("Active user could not be deleted");
          console.log(err);
        } else {
          io.emit('userDisc', user);
          user = null;
        }
      });
    }
  });
});

module.exports = { app: app, server: server };