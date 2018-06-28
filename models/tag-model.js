var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = Schema({
    tag: String,
    url: String
});


module.exports = mongoose.model("Tag", TagSchema);