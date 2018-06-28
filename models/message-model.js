var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
    message: String,
    from_user: String,
    date_sent: Date,
    tags: Array
});

module.exports = mongoose.model("Message", MessageSchema);