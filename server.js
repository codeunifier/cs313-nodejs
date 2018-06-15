var http = require('http');
var fs = require('fs');
var url = require('url');
// var args = process.argv.slice(2);

var port = 8888;

var isStarted = false;

function HandleRequests(request, response) {
    var parsedURL = url.parse(request.url, true);
    
    if (parsedURL.pathname == '/home') {
        console.log("directing to: " + parsedURL.pathname);
        response.writeHead(202, { 'Content-Type': 'text/html' });
        fs.createReadStream('hello-world.html').pipe(response);
    } else if (parsedURL.pathname == '/getData') {
        console.log("directing to: " + parsedURL.pathname);
        response.writeHead(202, { 'Content-Type': 'text/json' });
        fs.createReadStream('data.json').pipe(response);
    } else if (parsedURL.pathname == '/favicon.ico') {
        response.writeHead(200, { 'Content-Type': 'image/x-icon' });
        response.end();
    } else if (isStarted) {
        console.log("unkown request: " + parsedURL.pathname);
        response.writeHead(404, { 'Content-Type': 'text/html' });
        fs.createReadStream('404/404.html').pipe(response);
    }
}

if(http.createServer(HandleRequests).listen(port)) {
    isStarted = true;
    console.log("Server connected at port " + port);
}