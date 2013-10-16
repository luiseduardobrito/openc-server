var express = require('express');
var socketio = require('socket.io')
var walk    = require('walk');

var log = require("winston");
var fs = require("fs");

var ViewerHandler = require("./viewer");

var Application = function() {
	
	var _this = this;

	_this.exports = {};
	_this.actions = [];

	_this.init = function(){

		// initialize actions
		_this.getActions();

		// initialize web server
		_this.startWebServer();

		// connect to client
		_this.client = new ViewerHandler(_this.io);

		return exports;
	}

	_this.startWebServer = function() {
		
		log.info("starting express web server...")
		_this.server = express();

		log.info("listening on port 3000!")
		_this.server.listen(3000);

		http = require('http')
  		http = http.createServer(_this.server)

		log.info("starting web socket server...")
		_this.io = socketio.listen(http)
	}

	_this.getActions = function(cb) {

		cb = cb || function(){};
		var files   = [];

		var walker  = walk.walk('./actions', { followLinks: false });

		walker.on('file', function(root, stat, next) {

		    var action = require(root + '/' + stat.name);
		    
		    for(var k in action)
		    	_this.server.get("/" + stat.name.split(".js")[0] + "/" + k, action[k]);

		});

		walker.on('end', function() {
		    console.log("actions loaded successfully...");
		    cb();
		});
	}

	return _this.init();
}

var app = new Application();