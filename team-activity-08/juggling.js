// This problem is the same as the previous problem (HTTP COLLECT) in that
//   you need to use http.get(). However, this time you will be provided with
//   three URLs as the first three command-line arguments.

//   You must collect the complete content provided to you by each of the URLs
//   and print it to the console (stdout). You don't need to print out the
//   length, just the data as a String; one line per URL. The catch is that you
//   must print them out in the same order as the URLs are provided to you as
//   command-line arguments.

var http = require('http');
var bl = require('bl');
var args = process.argv.slice(2);

var response1 = "";
var response2 = "";
var response3 = "";

var count = 0;

var callback = function () {
    count++;

    if (count == 3) {
        console.log(response1);
        console.log(response2);
        console.log(response3);
    }
}

http.get(args[0], function (response) {
    response.pipe(bl(function (err, data) {
        response1 = data.toString();
        callback();
    }));
});

http.get(args[1], function (response) {
    response.pipe(bl(function (err, data) {
        response2 = data.toString();
        callback();
    }));
});

http.get(args[2], function (response) {
    response.pipe(bl(function (err, data) {
        response3 = data.toString();
        callback();
    }));
});