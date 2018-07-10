var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var server = require('../app').server;
var authFunc = require('../routes/index').auth;
var mongooseMiddleware = require('../local_modules/mon-mid');

var bcrypt = require('bcrypt');
var User = require('../models/user-model');
var ActiveUser = require('../models/active-user-model');
var Message = require('../models/message-model');

chai.use(chaiHttp);

var expect = chai.expect;

describe("Index Tests", function () {
    it("should be true", function () {
        expect(true).to.equal(true);
    });

    it('should return login view as html', function () {
        return chai.request(server)
            .get('/login')
            .then(function (res) {
                expect(res.statusCode).to.equal(200);
                expect(res.header['content-type']).to.equal('text/html; charset=utf-8');
            });
    });

    it('should redirect to login page when no session cookie is present', function () {
        return chai.request(server)
            .get('/main')
            .then(function (res) {
                expect(res.statusCode).to.equal(200);
                expect(res.header['content-type']).to.equal('text/html; charset=utf-8');
                expect(res.redirects[0].includes('/login')).to.equal(true);
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
                expect(null).to.equal("Redirect called: " + str);
            },
            sendStatus: function (status) {
                expect(null).to.equal("Send status called :" + status);
            }
        },
        next = function () {
            expect(true).to.equal(true);
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
                expect(str).to.equal("/login");
            },
            sendStatus: function (status) {
                expect(null).to.equal("Send status called :" + status);
            }
        },
        next = function () {
            expect(true).to.equal("User authenticated when it shouldn't have");
        };

        authFunc(req, res, next);
    });

    it('should send forbidden status if the session does not exist', function () {
        var req = {
            session: null
        },
        res = {
            redirect: function (str) {
                expect(null).to.equal("Redirect called: " + str);
            },
            sendStatus: function (status) {
                expect(status).to.equal(403);
            }
        },
        next = function () {
            expect(true).to.equal("User authenticated when it shouldn't have");
        };

        authFunc(req, res, next);
    });
});

describe("Mongoose Middleware Tests", function () {
    it('should flag invalid password in bcrypt when inserting new user', function (done) {
        var createStub = sinon.stub(User, 'create');

        var fakeUserModel = {
            username: "fake test user",
            password: 500
        };

        mongooseMiddleware.insertNewUser(fakeUserModel, function (response, didInsert) {
            expect(String(response).includes("Error: data must be a string")).to.equal(true);
            expect(didInsert).to.equal(false);

            expect(createStub.calledOnce).to.equal(false);

            createStub.restore();
            done();
        });
    });

    //probably not the best way to do this test, but it works
    it('should call create function with valid input data', function () {
        var bcryptStub = sinon.stub(bcrypt, 'hash');
        var createStub = sinon.stub(User, 'create');

        var fakeUserModel = {
            username: "fake test user",
            password: "password"
        };

        mongooseMiddleware.insertNewUser(fakeUserModel, null);

        //get callback function passed to bcrypt stub and call it
        bcryptStub.args[0][2](null, "hash");

        expect(createStub.calledOnce).to.equal(true);

        createStub.restore();
        bcryptStub.restore();
    });

    it('should call bcrypt compare when validating user input', function () {
        var findOneStub = sinon.stub(User, 'findOne');
        var compareStub = sinon.stub(bcrypt, 'compare');

        mongooseMiddleware.validateUserCredentials("fake test user", "password", null);

        findOneStub.args[0][1](null, {
            toObject: function () {
                return {
                    password_hash: "password"
                }
            }
        });

        expect(findOneStub.calledOnce).to.equal(true);
        expect(compareStub.calledOnce).to.equal(true);
        expect(compareStub.args[0][0]).to.equal("password");
        expect(compareStub.args[0][1]).to.equal("password");

        findOneStub.restore();
        compareStub.restore();
    });

    it('should call message model create method when inserting message', function () {
        var createStub = sinon.stub(Message, 'create');
        
        var fakeMessageModel = {
            from_user: "fake test user",
            message: "fake messagee",
            tags: []
        }

        mongooseMiddleware.insertMessage(fakeMessageModel, null);

        expect(createStub.calledOnce).to.equal(true);

        createStub.restore();
    });

    it('should call message model find method with a 100-document limit when getting conversation', function (done) {
        var findStub = sinon.stub(Message, 'find').returns({
            limit: function (lim) {
                expect(lim).to.equal(100);
                done();
            }
        });

        mongooseMiddleware.getConversation();

        expect(createStub.calledOnce).to.equal(true);

        findStub.restore();
    });

    it('should call active user model find method when getting active users', function () {
        var findStub = sinon.stub(ActiveUser, 'find');

        mongooseMiddleware.getActiveUsers();

        expect(findStub.calledOnce).to.equal(true);

        findStub.restore();
    });

    it('should call active user create method when inserting active user', function () {
        var createStub = sinon.stub(ActiveUser, 'create');

        mongooseMiddleware.insertActiveUser({
            user: "fake test user",
            socketId: "12345"
        });

        expect(createStub.calledOnce).to.equal(true);

        createStub.restore();
    });

    it('should call active user delete one method when deleting active user', function () {
        var deleteOneStub = sinon.stub(ActiveUser, 'deleteOne');

        mongooseMiddleware.deleteActiveUser("fake test user", null);

        expect(deleteOneStub.calledOnce).to.equal(true);

        deleteOneStub.restore();
    });
});

