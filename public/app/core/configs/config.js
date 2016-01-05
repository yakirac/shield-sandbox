(function() {
	"use strict";

	function onConfig($urlRouterProvider, RestangularProvider, SERVER_API_URL) {
		// set restful base API Route
		RestangularProvider.setBaseUrl(SERVER_API_URL);
		// set the `id` field to `_id`
		RestangularProvider.setRestangularFields({
			id: "_id"
		});
		//default to the root of the app
		$urlRouterProvider.otherwise("/");
	}

	function onRun($rootScope ) {
		$rootScope.$on("$stateChangeSuccess", function() {
			return;
		});
		return;
	}
	angular.module("app.core").config(["$urlRouterProvider", "RestangularProvider", "SERVER_API_URL", onConfig]).run(["$rootScope", "$location", onRun]).constant("SERVER_API_URL", "http://localhost:3000");
}());
