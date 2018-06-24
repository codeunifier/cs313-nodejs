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
                        console.log(data);
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
        }
    }
}