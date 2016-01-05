(function() {
	"use strict";
	angular.module("app.").config(["$urlRouterProvider", "$stateProvider", fnRoute]);
	function fnRoute($urlRouterProvider, $stateProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider.state("default", {
			url: "/",
			templateUrl: "",
			controller: "",
			controllerAs: "vm"
		});
	}
}());
