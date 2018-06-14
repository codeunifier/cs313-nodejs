// Write an HTTP server that receives only POST requests and converts
//   incoming POST body characters to upper-case and returns it to the client.

//   Your server should listen on the port provided by the first argument to
//   your program.

var fs = require('fs');
var http = require('http');
var map = require('through2-map');
var args = process.argv.slice(2);

http.createServer(function (request, response) {
    request.pipe(map(function (chunk) {
        return chunk.toString().toUpperCase();
    })).pipe(response);
}).listen(args[0]);