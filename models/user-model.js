var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var UserSchema = new Schema({
//     username: { type: String, required: true, index: { unique: true } },
//     password: { type: String, required: true }
// });

var UserSchema = Schema({
    username: String,
    password: String ,
    date_created: Date
});

UserSchema.pre("save", function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    //TODO: add password encryption
    //user.password = hash;
    next();
});

module.exports = mongoose.model("User", UserSchema);