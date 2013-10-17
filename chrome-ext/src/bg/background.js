var socket = io.connect('http://localhost:3000');

var BackgroundHandler = function(socket) {

	var stream = [];
	var currentlyPlaying = null;

	var play = function(location) {

		chrome.tabs.create({

			url: location

		}, function(){

			console.log("Playing: " + location)
		})
	}

	var init = function() {

		socket.on("stream/success", function(data) {

			stream = data.stream || [];

			if(!currentlyPlaying) {
				play(stream.pop())
			}
		});

		// and here we go...
		socket.emit("stream/get", {});
	}

	return init();
}

var bg = new BackgroundHandler(socket);