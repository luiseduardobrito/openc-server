module.exports = {

	push: function(req, res, viewer) {
		viewer.push(req.param("url"))

		res.json({
			result: "success"
		});

		return;
	},

	get: function(req, res, viewer) {

		viewer.push(req.param("url"));

		res.json({
			result: "success"
		});

		return;
	}
}