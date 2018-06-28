var express = require('express');
var router = express.Router();

const mtg = require('mtgsdk');

router.get('/', function(req, res, next) {
    res.redirect('/main');
});


/****************************************************
 * AJAX CALLS
 * *************************************************/

router.get('/card/:id', function (req, res, next) {
    mtg.card.find(req.params.id).then(function(result) {
        res.send(result);
    });
});

module.exports = router;