var express = require('express');
var socketio = require('socket.io')
var http = require('http');
var walk    = require('walk');

var log = require("winston");
var fs = require("fs");

var ViewerHandler = require("./viewer");

var Application = function() {
	
	var _this = this;

	_this.exports = {};
	_this.actions = [];

	_this.client = null;

	_this.init = function(){

		// initialize actions
		_this.getActions();

		// initialize web server
		_this.startWebServer();

		return exports;
	}

	_this.startWebServer = function() {
		
		log.info("starting express web server...")
		_this.server = express();
  		_this.httpServer = http.createServer(_this.server)

		log.info("starting web socket server...")
		_this.io = socketio.listen(_this.httpServer)
		//_this.io.set('log level', 1);

		log.info("listening on port 3000!")
		_this.httpServer.listen(3000);

		log.info("connecting with client viewer...")
		_this.client = new ViewerHandler(_this.io, function(){
			log.info("client connected successfully!");
		});
	}

	_this.getActions = function(cb) {

		cb = cb || function(){};
		var files   = [];

		var walker  = walk.walk('./actions', { followLinks: false });

		walker.on('file', function(root, stat, next) {

		    var action = require(root + '/' + stat.name);
		    
		    for(var k in action)
		    	_this.server.get("/" + stat.name.split(".js")[0] + "/" + k, function(req, res){

		    		action[k](req, res, _this.client);

		    	});

		    next();

		});

		walker.on('end', function() {
		    console.log("actions loaded successfully...");
		    cb();
		});
	}

	return _this.init();
}

var app = new Application();