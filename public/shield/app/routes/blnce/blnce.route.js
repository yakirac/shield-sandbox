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
		}).state("blnce.login", {
			url: "/login",
			templateUrl: "shield/app/routes/blnce/partials/blnce.login.html",
		}).state("blnce.home", {
			url: "/home",
			templateUrl: "shield/app/routes/blnce/partials/blnce.home.html",
		}).state("blnce.user", {
			url: "/user",
			templateUrl: "shield/app/routes/blnce/partials/blnce.user.html",
			controller: "blnceUserController",
			controllerAs: "blnceUser"
		});
	}

	function fnRun( $rootScope, $location, ParseService )
	{
		return;
	}
}());
