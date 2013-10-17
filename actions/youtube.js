var util = require("util");

var VIDEO_BY_ID = "https://www.youtube.com/watch?v=%s";

module.exports = {
	
	get: function(req, res, viewer) {

		if(!req.param("id")) {

			res.json({
				result: "error",
				message: "no video id supplied"
			})

			return;

		}

		var url = util.format(VIDEO_BY_ID, req.param("id"));

		viewer.push(url)

		res.json({
			result: "success"
		})
	}
}