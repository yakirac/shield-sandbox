(function() {
	"use strict";

	function setDefaultRoutes(app) {
		app.route("/").get(function(req, res) {
			res.render("index.html");
		});
		app.route("/angular-apps").get(function(req, res) {
			res.render("index.angular-apps.html");
		});
		app.route("/vanillajs/yt-upload-example").get(function(req, res) {
			res.render("upload_video.html");
		});
	}
	module.exports = setDefaultRoutes;
}());
