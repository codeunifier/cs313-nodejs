var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var assignmentsRouter = require('./routes/assignments');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set socket io
app.set('socketio', io)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//database setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/myDB');

var messageSchema = mongoose.Schema({
  _id: Number,
  message: String,
  from_user: String
});

var messageModel = mongoose.model("messages", messageSchema);

//Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/assignments', assignmentsRouter);

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
    var newMsg = new messageModel(model);
    // console.log("New model for database:");
    // console.log(newMsg);
    // newMsg.save().then(item => {
    //   console.log("Successfully saved to database");
    //   // console.log(item);
    // }).catch(err => {
    //   console.log("Unable to save to database");
    //   // console.log(err);
    // });

    io.emit('chat', model);
  });

  socket.on('userLoaded', function (username) {
    io.emit('newUser', username);
  });

  socket.on('disconnect', function () {
    console.log("user disconnected");
  });
});

module.exports = { app: app, server: server };