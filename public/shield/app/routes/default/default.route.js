(function() {
	"use strict";
	angular.module("app.shield.default").config(["$urlRouterProvider", "$stateProvider", fnRoute]);

	function fnRoute($urlRouterProvider, $stateProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state("default", {
			url: "/",
			templateUrl: "shield/app/routes/default/default.html",
			controller: "defaultController",
			controllerAs: "defController"
		});
	}
}());
