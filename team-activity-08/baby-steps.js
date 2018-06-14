var sum = 0;

process.argv.forEach(function (val, index, array) {
    if (index > 1) {
        sum += parseInt(val);
    }
});

console.log(sum);