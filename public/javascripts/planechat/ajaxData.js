var ajaxData = function () {
    return {
        login: function (username, password) {
            var deferred = $.Deferred();

            $.ajax({
                method: "POST",
                url: "/login",
                data: { username: username, password: password },
                dataType: "json",
                success: function (data) {
                    if (data != null) {
                        deferred.resolve(data);
                    }
                },
                error: function (error) {
                    deferred.resolve({
                        error: error.responseText
                    });
                }
            });

            return deferred.promise();
        },
        newAccount: function (username, password) {
            var deferred = $.Deferred();

            $.ajax({
                method: "POST",
                url: "/newAccount",
                data: { username: username, pass: password },
                dataType: "json",
                success: function (data) {
                    if (data != null) {
                        deferred.resolve(data);
                    }
                },
                error: function (err) {
                    deferred.resolve({
                        error: err.responseText
                    });
                }
            })

            return deferred.promise();
        },
        getConversation: function () {
            var deferred = $.Deferred();

            $.ajax({
                method: "GET",
                url: "/conversation",
                dataType: "json",
                success: function (data) {
                    if (data != null) {
                        deferred.resolve(data);
                    }
                },
                error: function (err) {
                    deferred.resolve({
                        error: err.responseText
                    });
                }
            });

            return deferred.promise();
        },
        getActiveUsers: function () {
            var deferred = $.Deferred();

            $.ajax({
                method: "GET",
                url: "/activeusers",
                dataType: "json",
                success: function (data) {
                    if (data != null) {
                        deferred.resolve(data);
                    }
                },
                error: function (err) {
                    deferred.resolve({
                        error: err.responseText
                    });
                }
            });

            return deferred.promise();
        }
    }
}