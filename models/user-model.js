var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    username: String,
    password_hash: String,
    date_created: Date,
    date_deleted: Date
});

module.exports = mongoose.model("User", UserSchema);