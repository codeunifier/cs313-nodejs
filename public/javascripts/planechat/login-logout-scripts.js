// entropy.js MIT License © 2014 James Abney http://github.com/jabney
// ES6 portation MIT License © 2017 Peter Seprus http://github.com/ppseprus

// Calculate the Shannon entropy of a string in bits per symbol.
(function (shannon) {
    'use strict';

    // Create an array of character frequencies.
    const getFrequencies = str => {
        let dict = new Set(str);
        return [...dict].map(chr => {
            return str.match(new RegExp(chr, 'g')).length;
        });
    };

    // Measure the entropy of a string in bits per symbol.
    shannon.entropy = str => getFrequencies(str)
        .reduce((sum, frequency) => {
            let p = frequency / str.length;
            return sum - (p * Math.log(p) / Math.log(2));
        }, 0);

    // Measure the entropy of a string in total bits.
    shannon.bits = str => shannon.entropy(str) * str.length;

    // Log the entropy of a string to the console.
    shannon.log = str => console.log(`Entropy of "${str}" in bits per symbol:`, shannon.entropy(str));

})(window.shannon = window.shannon || Object.create(null));


function toggleViews(viewNum) {
    if (viewNum) {
        //new account
        $("#loginContainer").hide();
        $("#accountContainer").show();
    } else {
        //login
        $("#accountContainer").hide();
        $("#loginContainer").show();
    }
}

function validateAccountForm() {
    var user = $("#a_user").val();
    var pass = $("#a_pass").val();
    var passV = $("#a_passVerify").val();

    if (pass === passV) {
        var entropy = shannon.entropy(pass);
        if (entropy > 3.3) {
            return true;
        } else {
            document.getElementById("errorMessage").innerText = "Password entropy must be greater than 3.3 Current entropy: " + entropy;
            $("#errorMessage").show();
            return false;
        }
    } else {
        document.getElementById("errorMessage").innerText = "Passwords do not match";
        $("#errorMessage").show();
        return false;
    }
}

function validateLoginForm() {
    var user = $("#l_user").val();
    var pass = $("#l_pass").val();

    return user != "" && pass != "";
}

function onLoginClick() {
    if (validateLoginForm()) {
        var user = $("#l_user").val();
        var pass = $("#l_pass").val();

        var ajax = new ajaxData();

        ajax.login(user, pass).done(function (data) {
            if (data.error == null) {
                window.location = "/main";
            } else {
                document.getElementById("errorMessage").innerText = data.error;
                $("#errorMessage").show();
            }
        });
    }
}