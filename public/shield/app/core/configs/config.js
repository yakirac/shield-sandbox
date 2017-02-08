(function() {
	"use strict";

	angular.module("app.core")
		.config(["$urlRouterProvider", "$httpProvider", "RestangularProvider", "SERVER_API_URL", onConfig])
		.run(["$rootScope", "$location", onRun])
		.constant("SERVER_API_URL", "http://localhost:3800");

	function onConfig($urlRouterProvider, $httpProvider, RestangularProvider, SERVER_API_URL) {
		//http defaults
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

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
}());
