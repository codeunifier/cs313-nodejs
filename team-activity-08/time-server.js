// Write a TCP time server!

//   Your server should listen to TCP connections on the port provided by the
//   first argument to your program. For each connection you must write the
//   current date & 24 hour time in the format:

//      "YYYY-MM-DD hh:mm"

//   followed by a newline character. Month, day, hour and minute must be
//   zero-filled to 2 integers. For example:

//      "2013-07-06 17:42"

//   After sending the string, close the connection.

var net = require('net');
var args = process.argv.slice(2);

var port = args[0];

function getDateString(date) {
    var stringDate = date.getFullYear() + '-';

    if (date.getMonth() + 1 < 10) {
        stringDate += "0";
    }

    stringDate += date.getMonth() + 1 + '-';

    if (date.getDate() < 10) {
        stringDate += "0";
    }

    stringDate += date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

    return stringDate;
}

net.createServer(function (socket) {
    var date = new Date();

    socket.end(getDateString(date) + "\n");
}).listen(port);