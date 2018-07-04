var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.redirect('/');
});

router.get('/week08', function (req, res, next) {
    res.redirect('/');
});
router.get('/week08/personal', function (req, res, next) {
    res.render('assignments/personal-08', { title: "Week 08 Personal" });
});

router.get('/week09', function (req, res, next) {
    res.redirect('/');
});
router.get('/week09/personal', function (req, res, next) {
    res.render('assignments/personal-09', { title: "Week 09 Personal", error: "" });
});
router.get('/getRate', function (req, res, next) {
    var type = req.query.type;
    var weight = req.query.weight;

    var weightPriceDict = {
        "Letters (Stamped)": {
            1: .5, 2: .71, 3: .92, 4: 1.13
        },
        "Letters (Metered)": {
            1: .47, 2: .68, 3: .89, 4: 1.1
        },
        "Large Envelopes (Flat)": {
            1: 1, 2: 1.21, 3: 1.42, 4: 1.63, 5: 1.84, 6: 2.05, 7: 2.26, 8: 2.47, 9: 2.68, 10: 2.89, 11: 3.10, 12: 3.31, 13: 3.52
        },
        "First-Class Package Service - Retail": {
            1: 3.5, 2: 3.5, 3: 3.5, 4: 3.5, 5: 3.75, 6: 3.75, 7: 3.75, 8: 3.75, 9: 4.1, 10: 4.45, 11: 4.8, 12: 5.15, 13: 5.5
        }
    }

    var result = weightPriceDict[type][Math.ceil(weight)];

    if (result) {
        result = result.toFixed(2);
        res.render('assignments/personal-09-result', { title: "Result", type: type, weight: weight, result: result });
    } else {
        res.render('assignments/personal-09', { title: "Week 09 Personal", error: "Server error. Input received: " + type + ", " + weight });
    }
});
router.get('/week09/team', function (req, res, next) {
    res.render('assignments/team-09', { title: "Week 09 Team" });
});
router.get('/compute', function (req, res, next) {
    var o1 = parseInt(req.query.operand1);
    var o2 = parseInt(req.query.operand2);

    var result = null;

    switch(req.query.operator) {
        case "+":
            result = o1 + o2;
            break;
        case "-":
            result = o1 - o2;
            break;
        case "/":
            result = o1 / o2;
            break;
        case "*":
            result = o1 * o2;
            break;
        default:
            result = null;
            break;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ result: result }));
});
router.post('/compute', function (req, res) {
    var o1 = parseInt(req.body.operand1);
    var o2 = parseInt(req.body.operand2);
    var result = null;

    switch(req.body.operator) {
        case "+":
            result = o1 + o2;
            break;
        case "-":
            result = o1 - o2;
            break;
        case "/":
            result = o1 / o2;
            break;
        case "*":
            result = o1 * o2;
            break;
        default:
            result = null;
            break;
    }

    res.render('assignments/team-09-result', { title: "Result", result: result });
});


router.get('/team', function (req, res, next) {
    res.redirect('/');
});

router.get('/week11/team', function (req, res, next) {
    res.render('assignments/team-11', { title: "Week 11 Team" });
});

module.exports = router;
