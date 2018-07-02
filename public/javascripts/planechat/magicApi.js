var MagicApi = function () {
    return {
        queryCardsByName: function (text) {
            var deferred = $.Deferred();

            $.ajax({
                type: "GET", //TODO: change this to go through my server
                url: "https://api.magicthegathering.io/v1/cards?name=" + text,
                data: {},
                success: function (data) { 
                    if (data != null) {
                        deferred.resolve(data);
                    }
                },
                error: function(request, textStatus, errorThrown) { 
                    if (request.status === 404) {
                        deferred.resolve({ error: "Something" });
                    }
                    console.log("Error: " + textStatus);
                },
                dataType: "json"
            });

            return deferred.promise();
        },
        getCardByMultiverseId: function (multiverseid) {
            var deferred = $.Deferred();

            $.ajax({
                type: "GET",
                url: "/magic/card/" + multiverseid,
                dataType: "json",
                success: function(data) {
                    if (data != null) {
                        deferred.resolve(data);
                    }
                },
                error: function(request, textStatus, errorThrown) {
                    console.log("Error: " + textStatus);
                } 
            });

            return deferred.promise();
        }
    }
}