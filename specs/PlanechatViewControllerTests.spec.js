describe("Planechat Tests", function () {
    beforeAll(function () {
        eventCallbacks = [

        ],
        view = {
            init: function () {},
            getSearchInput: function () {
                return {
                    on: function () {}
                }
            },
            getEventWrapper: function () {
                return {
                    on: function (event, elm, callback) {
                        eventCallbacks[event + ", " + elm] = callback;
                    }
                }
            },
            setMainChatContainerScroll: function () {},
            setMainChatContainerScrollAnimation: function () {},
            getExpandButton: function () {
                return {
                    click: function () {}
                }
            },
            addOnlineUser: function () {},
            createChatRow: function () {},
            getOnlineUsersListItems: function () {},
            removeUserFromOnlineUsersList: function () {},
            windowRedirect: function () {},
            createPopupAtElement: function () {},
            removePopup: function () {},
        },
        magic = {

        },
        repository = {
            getActiveUsers: function () {},
            getConversation: function () {}
        },
        socketCallbacks = [

        ],
        socket = {
            on: function (key, func) {
                socketCallbacks[key] = func;
            },
            emit: function () {},
        },
        io = {
            connect: function () {
                return socket;
             }
        }
    });
    beforeEach(function () {
        //initialize the promises
        users = $.Deferred(),
        conversation = $.Deferred();

        spyOn(document, 'getElementById').and.returnValue({});
        spyOn(repository, 'getActiveUsers').and.returnValue(users.promise());
        spyOn(repository, 'getConversation').and.returnValue(conversation.promise());            
    });
    afterEach(function () {
        
    });
   
    it('should call some functions on initialize', function () {
        spyOn(view, 'init');
        spyOn(socket, 'on');
        spyOn(socket, 'emit');
        spyOn(view, 'getEventWrapper').and.returnValue({
            on: function () {}
        });

        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        expect(view.init).toHaveBeenCalled();
        expect(document.getElementById).toHaveBeenCalled();
        expect(repository.getActiveUsers).toHaveBeenCalled();
        expect(repository.getConversation).toHaveBeenCalled();
        expect(socket.on).toHaveBeenCalledTimes(4);
        expect(socket.emit).toHaveBeenCalledWith('userLoaded');
        expect(view.getEventWrapper).toHaveBeenCalledTimes(4);
    });

    it('should add online user for each user received', function () {
        users.resolve([
            { username: "fake test 1" },
            { username: "fake test 2" },
            { username: "fake test 3" }
        ]);

        spyOn(view, 'addOnlineUser');

        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        expect(view.addOnlineUser).toHaveBeenCalledTimes(3);
    });

    it('should add a chat item for each chat message received', function () {
        conversation.resolve([
            {},{},{}
        ]);

        spyOn(view, 'createChatRow');
        spyOn(view, 'setMainChatContainerScrollAnimation');

        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        expect(view.createChatRow).toHaveBeenCalledTimes(3);
        expect(view.setMainChatContainerScrollAnimation).toHaveBeenCalled();
    });

    xit('should query cards on search input update', function () {

    });

    //mouse event callbacks
    it('should set mouse event callback functions on init', function () {
        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        expect(typeof eventCallbacks['mouseover, .card-tag']).not.toEqual('undefined');
        expect(typeof eventCallbacks['mouseout, .card-tag']).not.toEqual('undefined');
        expect(typeof eventCallbacks['click, .card-tag']).not.toEqual('undefined');
        expect(typeof eventCallbacks['click, .util-send span']).not.toEqual('undefined');
    });

    it('should create popup element on card tag mouseover', function () {
        spyOn(view, 'createPopupAtElement');

        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        eventCallbacks['mouseover, .card-tag']();

        expect(view.createPopupAtElement).toHaveBeenCalled();
    });

    it('should remove popup on card tag mouseout', function () {
        spyOn(view, 'removePopup');

        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        eventCallbacks['mouseout, .card-tag']();

        expect(view.removePopup).toHaveBeenCalled();
    });
    
    //socket tests
    it('should set socket listeners on init', function () {
        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        expect(typeof socketCallbacks['newChat']).not.toEqual('undefined');
        expect(typeof socketCallbacks['userConn']).not.toEqual('undefined');
        expect(typeof socketCallbacks['userDisc']).not.toEqual('undefined');
        expect(typeof socketCallbacks['disconnect']).not.toEqual('undefined');
    });

    it('should create chat row on socket newChat', function () {
        spyOn(view, 'createChatRow');
        spyOn(view, 'setMainChatContainerScroll');

        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        socketCallbacks['newChat'](null);

        expect(view.createChatRow).toHaveBeenCalled();
        expect(view.setMainChatContainerScroll).toHaveBeenCalled();
    });

    it('should add online user on socket userConn', function () {
        spyOn(view, 'addOnlineUser');

        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        socketCallbacks['userConn'](null);

        expect(view.addOnlineUser).toHaveBeenCalled();
    });

    it('should remove online user from active list on socket userDisc', function () {
        spyOn(view, 'removeUserFromOnlineUsersList');

        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        socketCallbacks['userDisc']('remove me');

        expect(view.removeUserFromOnlineUsersList).toHaveBeenCalledWith('remove me');
    });

    it('should redirect to login page on socket disconnect', function () {
        spyOn(view, 'windowRedirect');

        var controller = new PlanechatViewController(view, magic, repository, io);
        controller.init();

        socketCallbacks['disconnect']();

        expect(view.windowRedirect).toHaveBeenCalledWith('/login');
    });
});