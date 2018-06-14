// Write an HTTP server that serves JSON data when it receives a GET request
//   to the path '/api/parsetime'. Expect the request to contain a query string
//   with a key 'iso' and an ISO-format time as the value.

//   For example:

//   /api/parsetime?iso=2013-08-10T12:10:15.474Z

//   The JSON response should contain only 'hour', 'minute' and 'second'
//   properties. For example:

//      {
//        "hour": 14,
//        "minute": 23,
//        "second": 15
//      }

//   Add second endpoint for the path '/api/unixtime' which accepts the same
//   query string but returns UNIX epoch time in milliseconds (the number of
//   milliseconds since 1 Jan 1970 00:00:00 UTC) under the property 'unixtime'.
//   For example:

//      { "unixtime": 1376136615474 }

//   Your server should listen on the port provided by the first argument to
//   your program.

var fs = require('fs');
var http = require('http');
var url = require('url');
var map = require('through2-map');
var args = process.argv.slice(2);

http.createServer(function (request, response) {
    var parsedURL = url.parse(request.url, true);
    var date = new Date(parsedURL.query.iso);

    if (parsedURL.pathname.includes('parsetime')) {
        var resData = {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        }

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(resData));
    } else if (parsedURL.pathname.includes('unixtime')) {
        var resData = {
            "unixtime": date.getTime()
        }

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(resData));
    }
}).listen(args[0]);