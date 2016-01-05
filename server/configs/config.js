(function() {
	"use strict";
	var config = {};
	config.environment = process.env.NODE_ENV || "dev";
	// Upload files in memory
	config.uploadFilesInMemory = process.env.UPLOAD_FILES_IN_MEMORY || false;
	// Server settings
	config.server = {
		host: "0.0.0.0",
		port: process.env.NODE_PORT || process.env.PORT || 3800
	};
	//live reload
	config.live_reload = {
		port: process.env.NODE_LIVERELOAD || 35729
	};
	//set the default file extenstion
	config.file_exts = config.environment === "dev" ? ".dev.html" : ".html";

	//Set the Plaid environment
	//config.plaid_env = config.environment === "dev" ? "tartan" : "production";
	config.plaid_env = "tartan";
	//Set the db configs
	config.mongodb = { dbURI : "mongodb://127.0.0.1:27017", dbOptions : { user : "", pass : "" } };
	
	// Export configuration object
	module.exports = config;
}());
