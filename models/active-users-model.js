var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActiveUsersSchema = Schema({
    usernames: [{
        type: String
    }]
});

module.exports = mongoose.model("ActiveUsers", ActiveUsersSchema);