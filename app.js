var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('./local_modules/mon-mid');
var helmet = require('helmet');
var session = require('express-session');

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
  name: 'session',
  secret: "planechat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    expires: Date.now() + (60000 * 60 * 24 * 30 * 3)
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
    io.emit('newUser', username);
  });

  socket.on('disconnect', function () {
    console.log("user disconnected");
  });
});

module.exports = { app: app, server: server };