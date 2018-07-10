var PlanechatView = function () {
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

    return {
        init: function () {

        },
        getEventWrapper: function () {
            return $("body");
        },
        getMainChatContainer: function () {
            return $('#mainChatContainer');
        },
        setMainChatContainerScroll: function () {
            this.getMainChatContainer().scrollTop(this.getMainChatContainer()[0].scrollHeight);
        },
        setMainChatContainerScrollAnimation: function () {
            this.getMainChatContainer().animate({ scrollTop: this.getMainChatContainer().prop("scrollHeight")}, 1000);
        },
        getOnlineUsersList: function () {
            return $("#onlineUsersList");
        },
        getOnlineUsersListItems: function () {
            return $("#onlineUsersList li");
        },
        addOnlineUser: function (user) {
            this.getOnlineUsersList().append($('<li>').text(user));
        },
        getMessageInput: function () {
            return $('#messageInput');
        },
        getSearchInput: function () {
            return $("#searchInput");
        },
        createChatRow: function (model) {
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
        },
        clearCardTagsList: function () {
            $("#cardTagsList").html("");
        },
        addToCardTagList: function (card) {
            const tag = `
                    <span class="card-tag" id="${card.multiverseid}" title="${card.imageUrl}">${card.name}</span>
                `;
    
                $("#cardTagsList").append(tag);
        },
        clearSearchList: function () {
            $("#searchList").html("");
        },
        getSearchList: function () {
            return $("#searchList");
        },
        createSearchItem: function (card) {
            const resultHTML = `
                <div class="search-result" id="result_${card.multiverseid}">
                    <div class="cont-search-left">
                        <div class="util-send">
                            <span name="${card.multiverseid}" class="fa fa-arrow-alt-circle-left fa-2x"></span>
                        </div>
                    </div>
                    <div class="cont-search-img"><img src="${card.imageUrl}"></div>
                </div>
            `;

            this.getSearchList().append(resultHTML);
        },
        getExpandButton: function () {
            return $("#expandButton");
        },
        onRightExpandClick: function () {
            var isExpanded = this.getExpandButton().hasClass('fa-angle-right');
            this.getExpandButton().toggleClass('fa-angle-right', 'fa-angle-left');
        
            // if (isExpanded) {
            //     $("#gridWrapper").removeClass("expand-right");
            // } else {
            //     $("#gridWrapper").addClass("expand-right");
            // }
        }
    }
}