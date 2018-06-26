'use-strict'

var mongoose = require('mongoose');
var sanitize = require('mongo-sanitize');
var bcrypt = require('bcrypt');
var User = require('../models/user-model');
const SALT_ROUNDS = 13; //~ 1sec / hash

const MONGODB_URI = process.env.MONGOLAB_URI;

module.exports.attemptConnection = function attemptConnection(callback) {
    mongoose.connect(MONGODB_URI, {
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000
      }).catch(err => {
        callback(err);
      });
}

module.exports.insertNewUser = function insertNewUser(model, callback) {
    var sanUser = sanitize(model.username);
    var sanPass = sanitize(model.password);

    bcrypt.hash(sanPass, SALT_ROUNDS, function (err, hash) {
        if (err) {
            callback(err, false);
        } else {
            var dbModel = {
                username: sanUser,
                password_hash: hash,
                date_created: new Date()
            };

            mongoose.connection.collection("users").insert(dbModel, function (err, doc) {
                if (err) {
                    callback(err, false);
                } else {
                    callback(doc, true);
                }
            });
        }
    });
}

module.exports.validateUser = function validateUser(username, pass, callback) {
    var sanUser = sanitize(username);
    var sanPass = sanitize(pass);

    User.findOne({ username: sanUser }, function (err, user) {
        if (err) {
          callback(err, null);
        } else {
          if (user == null) {
            //no user found in database with that username
            callback(null, false);
          } else {
            user = user.toObject();
            console.log("Validating user credentials...");
            bcrypt.compare(sanPass, user.password_hash).then(function (res) {
                callback(null, res);
            });
          }
        };
    });
}