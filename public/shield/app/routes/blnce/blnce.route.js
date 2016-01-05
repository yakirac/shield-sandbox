(function() {
	"use strict";
	angular.module("app.shield.blnce").config(["$urlRouterProvider", "$stateProvider", fnRoute]).run(["$rootScope", "$location", "ParseService", fnRun]);

	function fnRoute($urlRouterProvider, $stateProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state("blnce", {
			url: "/blnce",
			templateUrl: "shield/app/routes/blnce/blnce.html",
			controller: "blnceController",
			controllerAs: "blnce"
		}).state("blnce/user", {
			url: "/blnce/user",
			templateUrl: "shield/app/routes/blnce/blnce.user.html",
			controller: "blnceUserController",
			controllerAs: "blnceUser"
		});
	}

	function fnRun( $rootScope, $location, ParseService )
	{
		return;
	}
}());
