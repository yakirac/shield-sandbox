(function() {
	'use strict';
	angular.module('app', [
	// angular modules
	'ngAnimate', 'ngMessages', 'ngRoute',
	// 3rd party modules
	'ui.router', 'restangular', 'ui.bootstrap.tabs', 'ui.bootstrap.tpls', 'gist',
	// app modules
	'app.core', 'app.default']);
})();