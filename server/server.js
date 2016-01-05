;(function(){
	"use strict";
	var logger, pkg, config, express;
	/**
	* Module dependencies.
	*/
	logger = require("mm-node-logger")(module);
	pkg = require("./package.json");
	config = require("./configs/config");
	express = require("./configs/express");
	// Initialize server
	function startServer() {
		// Initialize express
		var app = express.init();
		// Start up the server on the port specified in the config
		app.listen(config.server.port, function () {
			var serverBanner = ["",
				"*************************************" + " EXPRESS SERVER ".yellow + "********************************************",
				"*",
				"* " + pkg.description,
				"* @version " + pkg.version,
				"* @author " + pkg.author.name,
				"*",
				"*" + " App started on port: ".blue + config.server.port + " - with environment: ".blue + config.environment.blue,
				"*",
				"*************************************************************************************************",
				""].join("\n");
			logger.info(serverBanner);
		});
		module.exports = app;
	}
	startServer();
}());
