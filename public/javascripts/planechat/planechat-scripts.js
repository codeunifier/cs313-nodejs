var socket = io.connect();
           
socket.on('chat', function (model) {
    $("#chatList").append($('<li>').text(model.from_user + ": " + model.message));
});

socket.on('newUser', function (username) {
    $("#onlineUsersList").append($('<li>').text(username));
});

