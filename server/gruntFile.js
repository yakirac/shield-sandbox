(function() {
	"use strict";
	module.exports = function(grunt) {
		//asdf
		grunt.initConfig({
			useminPrepare: {
				html: "views/index.dev.html",
				options: {
					//where we compile our files
					//add to gitignore
					dest: "build",
					//important since this is where the relative files will map to
					root: "../public"
				}
			},
			usemin: {
				html: "views/index.html"
			},
			copy: {
				task0: {
					src: "views/index.dev.html",
					dest: "views/index.html"
				},
				task1: {
					src: "build/assets/css/bundle.min.css",
					dest: "../public/assets/css/bundle.min.css"
				},
				task2: {
					src: "build/assets/js/bundle.min.js",
					dest: "../public/assets/js/bundle.min.js"
				}
			},
			watch: {
				scripts: {
					files: "views/index.dev.html",
					tasks: ["build"]
				}
			},
			eslint: {
				options: {
					configFile: "eslint.json",
					format: require("eslint-tap"),
					outputFile: "logs/linterrors.txt"
				},
				target: [
					"utils/*.js",
					"routes/**/*.js",
					"configs/*.js",
					"/test/**/*.js",
					"/test/*.js",
					"../public/app/routes/**/*.js",
					"../public/app/services/*.js",
					"../public/app/core/**/*.js",
					"../public/app/core/*.js",
					"../public/app/components/**/*.js",
					"gruntFile.js",
					"server.js",
					"package.js"
				]
			}
		});
		grunt.loadNpmTasks("grunt-contrib-copy");
		grunt.loadNpmTasks("grunt-contrib-concat");
		grunt.loadNpmTasks("grunt-contrib-cssmin");
		grunt.loadNpmTasks("grunt-contrib-uglify");
		grunt.loadNpmTasks("grunt-contrib-watch");
		grunt.loadNpmTasks("grunt-usemin");
		grunt.loadNpmTasks("grunt-eslint");
		grunt.registerTask("verify", ["eslint"]);
		grunt.registerTask("build", [
			"eslint",
			"copy:task0",
			"useminPrepare",
			"concat",
			"cssmin",
			"uglify",
			"usemin",
			"copy:task1",
			"copy:task2"
		]);
	};
})();
