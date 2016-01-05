(function() {
	'use strict';
	angular.module('app', [
	// angular modules
	'ngAnimate', 'ngMessages', 'ngRoute', 'ngHolder',
	// 3rd party modules
	'ui.router', 'restangular', 'LocalStorageModule', 'angular-momentjs', 'ui.bootstrap.tabs', 'ui.bootstrap.tpls', 'gist',
	// app modules
	'app.core', 'app.shield.default', 'app.shield.mcmarveluniverse', 'app.shield.blnce']);
})();
