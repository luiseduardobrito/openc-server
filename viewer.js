var ViewerHandler = function(io) {

	var _this = this;

	_this.exports = {};
	_this.io = io;

	_this.clients = [];

	_this.init = function() {
		return _this.exports;
	}

	_this.connect = function(cb) {

		cb = cb || function(){};

		_this.io.sockets.on('connection', function (socket) {

			var _id = crypto.randomBytes(20).toString('hex');

			log.info("new client connected, wating handshake...")

			socket.on('handshake/request', function (data) {

				// handshake received, return connection id
				socket.emit('handshake/success', { 
					id: _id
				});

				console.log("new client connected: " + _id);
			});
		});
	}

	return _this.init();
}

module.exports = ViewerHandler;