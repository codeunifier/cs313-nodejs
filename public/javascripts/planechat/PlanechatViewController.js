var PlanechatViewController = function (view, magic, ajax, io) {
    var _view = view;
    var _socket = io.connect();
    var _magic = magic;
    var _dataRepository = ajax;

    var _results = [];
    var _tags = [];

    function connectSocketIO() {
        _socket.on('newChat', function (model) {
            _view.createChatRow(model);

            _view.setMainChatContainerScroll();
        });
        
        _socket.on('userConn', function (newUser) {
            _view.addOnlineUser(newUser);
        });
        
        _socket.on('userDisc', function (username) {
            _view.removeUserFromOnlineUsersList(username);
        });
        
        _socket.on('disconnect', function () {
            _view.windowRedirect('/login');
        });
    }
    
    function initialize() {
        //TODO: update on server-side to pull the actual user data
        _socket.emit('userLoaded');
    
        //get users currently online
        _dataRepository.getActiveUsers().done(function (data) {
            for (var i = 0; i < data.length; i++) {
                _view.addOnlineUser(data[i].username);
            }
        });
    
        //listen to other users connecting
    
        var form = document.getElementById('chatForm');
        
        form.onsubmit = function (event) {
            var model = {
                from_user: null, //TODO: update on server-side to pull the actual user data
                message: _view.getMessageInput().val(),
                tags: getCardTagsForMessage()
            }
    
            _socket.emit('chat', model);
    
            _view.getMessageInput().val('');
    
            clearTags();
            
            return false;
        }
    
        //set key listener for search input
        _view.getSearchInput().on("input", function (event) {
            var text = event.target.value;
    
            if (text.length > 2) {
                _magic.queryCardsByName(text).done(function (data) {
                    if (data) {
                        if (data.cards.length > 0) {
                            setSearchResults(data.cards);
                        } else {
                            setSearchResults(null);
                        }
                    }
                });
            } else {
                setSearchResults(null);
            }
        });
    
        //mouse event listeners for card tags
        _view.getEventWrapper().on('mouseover', '.card-tag', function () {
            _view.createPopupAtElement(this);
        });
    
        _view.getEventWrapper().on('mouseout', '.card-tag', function () {
            _view.removePopup();
        });
    
        _view.getEventWrapper().on('click', '.card-tag', function () {
            var tagInfo = _view.getTagInfoForElm(this);
            
            if (tagInfo.isNew) {
                onNewTagClick(tagInfo);
            }
        });

        _view.getEventWrapper().on('click', '.util-send span', function () {
            var id = $(this).attr('name');
            
            addCardTag(id);
        });
    
        _dataRepository.getConversation().done(function (data) {
            data.forEach(function (model) {
                _view.createChatRow(model);
            });
    
            _view.setMainChatContainerScrollAnimation();
        });
    }
    
    function getCardTagsForMessage() {
        var messageTags = [];
    
        for (var i = 0; i < _tags.length; i++) {
            messageTags.push({
                id: _tags[i].multiverseid,
                tag: _tags[i].name,
                url: _tags[i].imageUrl
            });
        }
    
        return messageTags;
    }
    
    function clearTags() {
        _tags = [];
    
        _view.clearCardTagsList();
    }
    
    function updateTagsOnDOM(clear) {
        _view.clearCardTagsList();
    
        if (!clear && _tags.length > 0) {
            //append the card tag elements
            for (var i = 0; i < _tags.length; i++) {
                _view.addToCardTagList(_tags[i]);
            }
        }
    }
    
    function addCardTag(multiverseid) {
        for (var i = 0; i < _results.length; i++) {
            if (_results[i].multiverseid == multiverseid) {
                _tags.push(_results[i]);
                break;
            }
        }
    
        updateTagsOnDOM();
    }
    
    function setSearchResults(cards) {
        _results = cards;

        _view.clearSearchList();
    
        if (_results != null) {
            //sort results by card name
            _results.sort(function (a, b) {
                if (a.name == b.name) {
                    return a.releaseDate > b.releaseDate ? 1 : -1;
                } else {
                    return a.name > b.name ? 1 : -1;
                }
            });
    
            //create the html
            for (var i = 0; i < _results.length; i++) {
                if (_results[i].imageUrl) {
                    _view.createSearchItem(_results[i]);
                } else {
                    //if there's no image for it, then just don't show it
                    _results.splice(i, 1);
                }
            }
        }
    }
    
    return {
        init: function () {
            _view.init(this);

            connectSocketIO();
            initialize();

            _view.getExpandButton().click(function () {
                _view.onRightExpandClick();
            });
        },
        onNewTagClick: function (tagInfo) {
            //remove from tags array
            for (var i = 0; i < _tags.length; i++) {
                if (_tags[i].multiverseid == tagInfo.multiverseid) {
                    _tags.splice(i, 1);
                    break;
                }
            }
        
            _view.removePopup();
            updateTagsOnDOM();
        }
    }
}