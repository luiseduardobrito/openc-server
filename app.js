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

	_this.getLocalIPs = function () {

		var addrInfo, ifaceDetails, _len;
		var localIPInfo = {};
		//Get the network interfaces
		var networkInterfaces = require('os').networkInterfaces();
		//Iterate over the network interfaces
		for (var ifaceName in networkInterfaces) {
		    ifaceDetails = networkInterfaces[ifaceName];
		    //Iterate over all interface details
		    for (var _i = 0, _len = ifaceDetails.length; _i < _len; _i++) {
		        addrInfo = ifaceDetails[_i];
		        if (addrInfo.family === 'IPv4') {
		            //Extract the IPv4 address
		            if (!localIPInfo[ifaceName]) {
		                localIPInfo[ifaceName] = {};
		            }
		            localIPInfo[ifaceName].IPv4 = addrInfo.address;
		        } else if (addrInfo.family === 'IPv6') {
		            //Extract the IPv6 address
		            if (!localIPInfo[ifaceName]) {
		                localIPInfo[ifaceName] = {};
		            }
		            localIPInfo[ifaceName].IPv6 = addrInfo.address;
		        }
		    }
		}
		return localIPInfo;
	};

	_this.startWebServer = function() {
		
		log.info("starting express web server...")
		_this.server = express();
  		_this.httpServer = http.createServer(_this.server)

  		_this.server.use("/", express.static(__dirname + "/public"));

		log.info("starting web socket server...")
		_this.io = socketio.listen(_this.httpServer)
		_this.io.set('log level', 1);

		// TODO: encapsulate port choosing
		log.info("listening on port 3000!")
		_this.httpServer.listen(3000);

		var addr = _this.getLocalIPs();
		
		for(var k in addr) {
			if(addr[k].IPv4 && addr[k].IPv4 != "127.0.0.1") {
				addr = addr[k].IPv4
				break;
			}
		}

		addr = addr + ":3000";
		var fs = require('fs');

		var file = fs.createWriteStream("public/assets/qrcode.png");
		var request = http.get("http://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=http://" + addr, function(response) {
			response.pipe(file);
			log.info("qrcoded ok!")
		});

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