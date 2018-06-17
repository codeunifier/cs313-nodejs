var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.redirect('/');
});

router.get('/week08', function (req, res, next) {
    res.redirect('/assignments/week08/personal')
});

router.get('/week08/personal', function (req, res, next) {
    res.send("Personal assignment");
});

router.get('/team', function (req, res, next) {
    res.send("Team assignment");
});

module.exports = router;
