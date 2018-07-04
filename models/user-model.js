var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    username: { type: String, unique: true },
    password_hash: {type: String, unique: true },
    date_created: Date,
    date_deleted: Date
});

module.exports = mongoose.model("User", UserSchema);