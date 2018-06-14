// Write an HTTP server that serves the same text file for each request it
//   receives.

//   Your server should listen on the port provided by the first argument to
//   your program.

//   You will be provided with the location of the file to serve as the second
//   command-line argument. You must use the fs.createReadStream() method to
//   stream the file contents to the response.

var fs = require('fs');
var http = require('http');
var args = process.argv.slice(2);

http.createServer(function (request, response) {
    fs.createReadStream(args[1]).pipe(response);
}).listen(args[0]);