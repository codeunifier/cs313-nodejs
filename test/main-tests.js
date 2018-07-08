var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app').server;
var authFunc = require('../routes/index').auth;

chai.use(chaiHttp);

describe("Index Tests", function () {
    it("should be true", function () {
        assert.equal(true, true);
    });

    it('should return login view as html', function () {
        return chai.request(server)
            .get('/login')
            .then(function (res) {
                assert.equal(res.statusCode, 200);
                assert.equal(res.header['content-type'], 'text/html; charset=utf-8');
            });
    });

    it('should redirect to login page when no session cookie is present', function () {
        return chai.request(server)
            .get('/main')
            .then(function (res) {
                assert.equal(res.statusCode, 200);
                assert.equal(res.header['content-type'], 'text/html; charset=utf-8');
                assert.equal(res.redirects[0].includes('/login'), true);
            });
    });

    it('should authenticate on session username', function () {
        var req = {
            session: {
                user: "tester"
            }
        },
        res = {
            redirect: function (str) {
                assert.equal(null, "Redirect called: " + str);
            },
            sendStatus: function (status) {
                assert.equal(null, "Send status called :" + status);
            }
        },
        next = function () {
            assert.equal(true, true);
        };

        authFunc(req, res, next);
    });

    it('should redirect to login if the session exists but not the username', function () {
        var req = {
            session: {
                user: null
            }
        },
        res = {
            redirect: function (str) {
                assert.equal(str, "/login");
            },
            sendStatus: function (status) {
                assert.equal(null, "Send status called :" + status);
            }
        },
        next = function () {
            assert.equal(true, "User authenticated when it shouldn't have");
        };

        authFunc(req, res, next);
    });

    it('should send forbidden status if the session does not exist', function () {
        var req = {
            session: null
        },
        res = {
            redirect: function (str) {
                assert.equal(null, "Redirect called: " + str);
            },
            sendStatus: function (status) {
                assert.equal(status, 403);
            }
        },
        next = function () {
            assert.equal(true, "User authenticated when it shouldn't have");
        };

        authFunc(req, res, next);
    });
});