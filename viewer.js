var log = require("winston");
var crypto = require("crypto");

var ViewerHandler = function(io) {

	var _this = this;

	_this.exports = {};
	_this.io = io;

	_this.clients = [];

	_this.init = function() {

		_this.connect();
		return _this.exports;
	}

	_this.connect = function(cb) {

		cb = cb || function(){};

		_this.io.sockets.on('connection', function (socket) {

			var _id = crypto.randomBytes(20).toString('hex');

			socket.on('stream/get', function (data) {

				socket.emit('stream/success', { 
					stream: ["http://google.com"]
				});
			});
		});
	}

	_this.redirect = function(url) {

		return null;

	}; _this.exports.redirect = _this.redirect;

	return _this.init();
}

module.exports = ViewerHandler;