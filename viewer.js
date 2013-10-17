var log = require("winston");
var crypto = require("crypto");

var ViewerHandler = function(io, cb) {

	var _this = this;

	_this.exports = {};

	_this.io = io;
	_this.socket = null;

	_this.init = function(cb) {

		cb = cb || function(){};

		_this.connect(cb);

		return _this.exports;
	}

	_this.connect = function(cb) {

		cb = cb || function(){};

		_this.io.sockets.on('connection', function (socket) {
			_this.socket = socket;
			cb();
		});
	}

	_this.push = function(url) {

		if(!url) {

			throw new Error("No url provided");
		}

		else if(!_this.socket) {

			throw new Error("No client connected");	
		}

		else {

			_this.socket.emit('stream/push', { 
				url: url
			});	
		}

	}; _this.exports.push = _this.push;

	return _this.init(cb);
}

module.exports = ViewerHandler;