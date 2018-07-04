function search(query) {
    var deferred = $.Deferred();

    $.ajax({
        method: "GET",
        url: "http://www.omdbapi.com/?apikey=3158d095" + query,
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

function onSearchButtonClick() {
    var text = $("#searchText").val();

    search("&s=" + text).done(function (data) {
        console.log(data);
        if (data.Response) {
            $("#resultTotal").text(data.totalResults);
            $("#resultNumber").text("1-10");

            for (var i = 0; i < data.Search.length; i++) {
                var movie = data.Search[i];

                var html = `
                    <div class="movie-item">
                        <div class="movie-poster"><img src="${movie.Poster}" onclick="onPosterClick('${movie.imdbID}')"/></div>
                        <div class="movie-title">${movie.Title}</div>
                        <div class="movie-year">${movie.Year}</div>
                    </div>
                `;

                $("#resultsList").append(html);
            }

            $("#resultsContainer").show();
        }
    });
}

function onPosterClick(imdbID) {
    search("&i=" + imdbID).done(function (data) {
        console.log(data);
        // createPopover(data);
    });
}

// function createPopover(data) {
//     var popupHTML = `
//         <div id="popup">
//             ${data.Plot}
//         </div>
//     `;
//     $("body").append(popupHTML);
//     var popup = $("#popup");
//     activePopper = new Popper(this, popup, {
//         placement: 'top'
//     });
//     popup.show();
// }