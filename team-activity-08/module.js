module.exports = function (dir, filter, callback) {
    var fs = require('fs');
    var path = require('path');

    fs.readdir(dir + "/", function (err, data) {
        if (!err) {
            var files = [];

            data.filter(function (e) {
                if (path.extname(e) == "." + filter) {
                    files.push(e);
                }
            });

            files.forEach(function (f) {
                console.log(f);
            });

            callback(null, files);
        } else {
            callback(err);
        }
    });
}