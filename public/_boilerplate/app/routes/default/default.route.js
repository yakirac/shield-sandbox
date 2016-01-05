(function() {
	"use strict";
	angular.module("app.default").config(["$urlRouterProvider", "$stateProvider", fnRoute]);

	function fnRoute($urlRouterProvider, $stateProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state("default", {
			url: "/",
			templateUrl: "app/routes/default/default.html",
			controller: "defaultController",
			controllerAs: "vm"
		});
	}
}());
