var socket = io.connect();

function getDateFormat(date) {
    var str = "Cannot determine time";
    var now = new Date();

    if (now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear()) {
        //today
        str = "Today at ";
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

socket.on('chat', function (model) {
    var img = "";
    var timeNow = getDateFormat(new Date());

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
                </div>
            </div>
        </div>
    `;
    // $("#chatList").append($('<li>').text(model.from_user + ": " + model.message));
    $("#chatList").append(row);
});

socket.on('newUser', function (username) {
    $("#onlineUsersList").append($('<li>').text(username));
});

function setSearchResults(cards) {
    var listElm = $("#searchList");
    listElm.html("");

    if (cards != null) {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].imageUrl) {
                const result = `
                    <div class="search-result" id="result_${cards[i].multiverseid}">
                        <div class="cont-search-left"></div>
                        <div class="cont-search-img"><img src="${cards[i].imageUrl}"></div>
                    </div>
                `;

                listElm.append(result);
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