var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActiveUserSchema = Schema({
    username: String,
    time_active: Date,
    socketId: String
});

module.exports = mongoose.model("ActiveUser", ActiveUserSchema);