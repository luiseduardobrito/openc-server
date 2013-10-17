var util = require("util");

var VIDEO_BY_ID = "https://www.youtube.com/watch?v=%s";

module.exports = {
	
	get: function(req, viewer) {

		var url = util.format(VIDEO_BY_ID, req.param("id"));
		viewer.stream.add(url)
	}
}