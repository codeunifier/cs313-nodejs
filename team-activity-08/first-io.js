// Write a program that uses a single synchronous filesystem operation to
// read a file and print the number of newlines (\n) it contains to the
// console (stdout), similar to running cat file | wc -l.
// The full path to the file to read will be provided as the first
// command-line argument (i.e., process.argv[2]). You do not need to make
// your own test file.

var fs = require('fs');
var args = process.argv.slice(2);
var buffer = fs.readFileSync(args[0]);

var str = buffer.toString();
var count = 0;
var findStr = "\n";
var lastIndex = 0;

while(lastIndex != -1) {
    lastIndex = str.indexOf(findStr,lastIndex);

    if(lastIndex != -1){
        count ++;
        lastIndex += findStr.length;
    }
}

console.log(count);