(function() {
	"use strict";
	angular.module("app.shield.mcmarveluniverse").config(["$urlRouterProvider", "$stateProvider", fnRoute]);

	function fnRoute($urlRouterProvider, $stateProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state("mcmarveluniverse", {
			url: "/mcmarveluniverse",
			templateUrl: "shield/app/routes/mcmarveluniverse/mcmarveluniverse.html",
			controller: "mmuController",
			controllerAs: "mmuController"
		});
	}
}());
