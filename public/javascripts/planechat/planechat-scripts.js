var _socket = io.connect();
var _magic = new MagicApi();
var _dataRepository = new ajaxData();
var _results = [];
var _tags = [];
var _username = null;

$.fn.exists = function () {
    return this.length !== 0;
}

function onLoadFunction() {
    _username = $('#hidden_username')[0].textContent;

    _socket.emit('userLoaded', _username);

    //get users currently online
    _dataRepository.getActiveUsers().done(function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#onlineUsersList").append($('<li>').text(data[i].username));
        }
    });

    //listen to other users connecting

    var form = document.getElementById('chatForm');
    
    form.onsubmit = function (event) {
        var model = {
            from_user: _username,
            message: $('#messageInput').val(),
            tags: getCardTagsForMessage()
        }

        _socket.emit('chat', model);

        $('#messageInput').val('');

        clearTags();
        
        return false;
    }

    //set key listener for search input
    $("#searchInput").on("input", function (event) {
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

    var activePopper = null;

    //mouse event listeners for card tags
    $("body").on('mouseover', '.card-tag', function () {
        var thisguy = $(this);

        var tagInfo = getTagInfo(thisguy);

        var popupHTML = `
            <div id="popup" name="tag_${tagInfo.multiverseid}" class="card-tag-image"><img src="${tagInfo.imageUrl}" onclick="onImageClick(${tagInfo.multiverseid})"></div>
        `;

        $("body").append(popupHTML);

        var popup = $("#popup");

        activePopper = new Popper(this, popup, {
            placement: 'top'
        });

        popup.show();

        thisguy.on('click', function (event) {
            if (tagInfo.isNew) {
                onNewTagClick(tagInfo);
            }
        });
    });

    $("body").on('mouseout', '.card-tag', function () {
        activePopper = null;
        $("#popup").hide();
        $("#popup").remove();
    });

    $("body").on('click', '.card-tag', function () {
        var tagInfo = getTagInfo($(this));
        
        if (tagInfo.isNew) {
            onNewTagClick(tagInfo);
        }
    });

    _dataRepository.getConversation().done(function (data) {
        data.forEach(function (model) {
            createChatRow(model);
        });

        $("#mainChatContainer").animate({ scrollTop: $('#mainChatContainer').prop("scrollHeight")}, 1000);
    });
}

function getDateFormat(date) {
    var str = "Cannot determine time";
    var now = new Date();

    if (now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear()) {
        //today
        str = "Today at ";
    } else {
        str = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " ";
    }

    var isAM;

    if (date.getHours() > 12) {
        isAM = false;
        str += (date.getHours() - 12) + ":";
    } else {
        isAM = true;
        str += (date.getHours()) + ":";
    }

    if (date.getMinutes() < 10) {
        str += "0";
    }

    str += date.getMinutes() + " ";

    str += isAM ? "a.m." : "p.m.";

    return str;
}

function createChatRow(model) {
    var img = "";
    var timeNow = getDateFormat(new Date(model.date_sent));

    const row = `
        <div class="list-item">
            <div class="chat-row">
                <div class="cont-image"><img src="${img}"></div>
                <div class="cont-content">
                    <div class="content-header">
                        <div class="from-user">${model.from_user}</div>
                        <div class="time-sent">${timeNow}</div>
                    </div>
                    <div class="cont-message">${model.message}</div>
                    <div class="cont-tags">
                        ${model.tags.map((item, i) => `
                            <span class="card-tag" id="${item.id}" title="${item.url}">${item.tag}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    $("#chatList").append(row);
}

_socket.on('newChat', function (model) {
    createChatRow(model);

    $('#mainChatContainer').scrollTop($('#mainChatContainer')[0].scrollHeight);
});

_socket.on('userConn', function (username) {
    $("#onlineUsersList").append($('<li>').text(username));
});

_socket.on('userDisc', function (username) {
    $("#onlineUsersList li").each(function (index) {
        if ($(this).innerHTML == username) {
            $("#onlineUsersList").remove(this);
        }
    });
});

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

    $("#cardTagsList").html("");
}

function updateTagsOnDOM(clear) {
    $("#cardTagsList").html("");

    if (!clear && _tags.length > 0) {
        //append the card tag elements
        for (var i = 0; i < _tags.length; i++) {
            const tag = `
                <span class="card-tag" id="${_tags[i].multiverseid}" title="${_tags[i].imageUrl}">${_tags[i].name}</span>
            `;

            $("#cardTagsList").append(tag);
        }

        var activePopper = null;

        //set mouse event listeners
        // $("#cardTagsList .card-tag").each(function (index) {
        //     var thisguy = $(this);
    
        //     thisguy.on('mouseover', function (event) {
        //         var popupHTML = `
        //             <div id="popup" name="tag_${_tags[index].multiverseid}" class="card-tag-image"><img src="${_tags[index].imageUrl}" onclick="onImageClick(${_tags[index].multiverseid})"></div>
        //         `;
    
        //         $("body").append(popupHTML);
    
        //         var popup = $("#popup");
    
        //         activePopper = new Popper(this, popup, {
        //             placement: 'top'
        //         });
    
        //         popup.show();
        //     });
    
        //     thisguy.on('mouseout', function (event) {
        //         $("#popup").hide();
        //         $("#popup").remove();
        //     });
    
        //     thisguy.on('click', function (event) {
        //         //remove from tags array
        //         for (var i = 0; i < _tags.length; i++) {
        //             if (_tags[i].name == event.target.innerText) {
        //                 _tags.splice(i, 1);
        //                 break;
        //             }
        //         }
        //         $("#popup").remove();
        //         updateTagsOnDOM();
        //     });
        // });
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
    var listElm = $("#searchList");
    listElm.html("");

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
                const resultHTML = `
                    <div class="search-result" id="result_${_results[i].multiverseid}">
                        <div class="cont-search-left">
                            <div class="util-send">
                                <span onclick="addCardTag(${_results[i].multiverseid})" class="fa fa-arrow-alt-circle-left fa-2x"></span>
                            </div>
                        </div>
                        <div class="cont-search-img"><img src="${_results[i].imageUrl}" onclick="onImageClick(${_results[i].multiverseid})"></div>
                    </div>
                `;

                listElm.append(resultHTML);
            } else {
                //if there's no image for it, then just don't show it
                _results.splice(i, 1);
            }
        }
    }
}

function onRightExpandToggle() {
    var isExpanded = $("#expandButton").hasClass('fa-angle-right');
    $("#expandButton").toggleClass('fa-angle-right', 'fa-angle-left');

    // if (isExpanded) {
    //     $("#gridWrapper").removeClass("expand-right");
    // } else {
    //     $("#gridWrapper").addClass("expand-right");
    // }
}

function onImageClick(multiverseid) {
    // _magic.getCardByMultiverseId(multiverseid).done(function (data) {
    //     console.log(data);
    // });
}

function getTagInfo(jElm) {
    return {
        isNew: jElm[0].parentElement.id == "cardTagsList",
        multiverseid: jElm[0].id,
        imageUrl: jElm[0].title
    }
}

function onNewTagClick(tagInfo) {
    //remove from tags array
    for (var i = 0; i < _tags.length; i++) {
        if (_tags[i].multiverseid == tagInfo.multiverseid) {
            _tags.splice(i, 1);
            break;
        }
    }

    $("#popup").remove();
    updateTagsOnDOM();
}