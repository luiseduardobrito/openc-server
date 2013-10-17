module.exports = {

	hello: function(req, res, viewer) {
		viewer.push("https://www.youtube.com/watch?v=WaKSQgq-8vc")

		res.json({
			result: "success"
		});

		return;
	}
}