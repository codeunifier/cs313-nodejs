'use-strict'

var mongoose = require('mongoose');
var sanitize = require('mongo-sanitize');
var bcrypt = require('bcrypt');

var User = require('../models/user-model');
var Message = require('../models/message-model');
var ActiveUser = require('../models/active-user-model');

const SALT_ROUNDS = 13; //~ 1sec / hash
const CONVERSATION_LIMIT = 100;
const MONGODB_URI = process.env.MONGOLAB_URI;

function validateData(colPath, data) {
    var isValid = false;

    if (data) {
        if (colPath == "users") {
            isValid = typeof data.username == "string"
                && typeof data.password_hash == "string"
                && typeof data.date_created == "object"; //TODO: figure out how to validate as a date
        } else if (colPath == "messages") {
            isValid = typeof data.message == "string"
                && Array.isArray(data.tags) //TODO: validate the tags in the array?
                && typeof data.from_user == "string"
                && typeof data.date_sent == "object"; //TODO: figure out how to validate as a date
        } else if (colPath == "activeUser") {
            isValid = typeof data.username == "string"
                && typeof data.time_active == "object" //TODO: figure out how to validate as a date
                && typeof data.socketId == "string";
        }
    }

    return isValid;
}

module.exports.attemptConnection = function attemptConnection(callback) {
    mongoose.connect(MONGODB_URI, {
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000
      }).catch(err => {
        if (callback) {
            callback(err);
        }
      });
}

module.exports.insertNewUser = function insertNewUser(model, callback) {
    var sanUser = sanitize(model.username);
    var sanPass = sanitize(model.password);

    bcrypt.hash(sanPass, SALT_ROUNDS, function (err, hash) {
        if (err) {
            if (callback) {
                callback(err, false);
            }
        } else {
            var userModel = new User({username: sanUser, password_hash: hash, date_created: new Date()});

            if (validateData("users", userModel)) {
                User.create(userModel/*dbModel*/, function (err, doc) {
                    if (err) {
                        if (callback) {
                            callback(err, false);
                        }
                    } else if (callback) {
                        callback(doc, true);
                    }
                });
            } else if (callback) {
                callback("Invalid input data", false);
            }
        }
    });
}

module.exports.deleteUserAccount = function deleteUserAccount() {
    //TODO: add user account deletion
}

module.exports.validateUserCredentials = function validateUser(username, pass, callback) {
    var sanUser = sanitize(username);
    var sanPass = sanitize(pass);

    User.findOne({ username: sanUser }, function (err, user) {
        if (err) {
            if (callback) {
                callback(err, null);
            }
        } else {
            if (user == null) {
                //no user found in database with that username
                if (callback) {
                    callback(null, false);
                }
            } else {
                //validating credentials...
                user = user.toObject();
                bcrypt.compare(sanPass, user.password_hash).then(function (res) {
                    if (callback) {
                        callback(null, res);
                    }
                });
            }
        };
    });
}

module.exports.insertMessage = function insertMessage(model, callback) {
    var sanUser = sanitize(model.from_user);
    var sanMessage = sanitize(model.message);
    var sanTags = [];

    for (var i = 0; i < model.tags.length; i++) {
        sanTags.push({
            id: sanitize(model.tags[i].id),
            tag: sanitize(model.tags[i].tag),
            url: model.tags[i].url
        });
    }

    var mModel = new Message({message: sanMessage, from_user: sanUser, tags: sanTags, date_sent: new Date()});

    if (validateData("messages", mModel)) {
        Message.create(mModel, function (err, doc) {
            if (err) {
                if (callback) {
                    callback(err, false);
                }
            } else {
                if (callback) {
                    callback(doc, true, mModel);
                }
            }
        });
    } else if (callback) {
        callback("Invalid input data", false);
    }
}

module.exports.getConversation = function getConversation(callback) {
    Message.find(function (err, docs) {
        if (callback) {
            callback(err, docs);
        }
    }).limit(CONVERSATION_LIMIT);
}

module.exports.getActiveUsers = function getActiveUsers(callback) {
    ActiveUser.find(function (err, docs) {
        if (callback) {
            callback(err, docs);
        }
    });
}

module.exports.insertActiveUser = function insertActiveUser(model, callback) {
    var sanUser = sanitize(model.user);

    var dbModel = new ActiveUser({ username: sanUser, time_active: new Date(), socketId: model.socketId });

    if (validateData("activeUser", dbModel)) {
        ActiveUser.create(dbModel, function (err, doc) {
            if (err) {
                if (callback) {
                    callback(err, false);
                }
            } else {
                if (callback) {
                    callback(doc, true);
                }
            }
        });
    } else if (callback) {
        callback("Invalid input data", false);
    }
}

module.exports.deleteActiveUser = function deleteActiveUser(username, callback) {
    var sanUser = sanitize(username);

    ActiveUser.deleteOne({username: sanUser}, function (err) {
        if (callback) {
            callback(err);
        }
    });
}