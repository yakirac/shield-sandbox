(function() {
	"use strict";

	function setDefaultRoutes(app) {
		app.route("/").get(function(req, res) {
			res.render("index.html");
		});
	}
	module.exports = setDefaultRoutes;
}());
