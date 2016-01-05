;(function(){
	'use strict';
	/**
	* @ngdoc directive
	* @name global.directive:header.directive
	* @scope
	* @restrict E
	*
	* @description
	* this will output the global header
	*
	*/
	angular.module( 'app.core' ).directive( "header", fnDirective );
	/**
	 * @ngdoc controller
	 * @name fnController
	 * @description
	 * This is the controller for this header
	 */
	angular.module("app.core").controller("headerController", [fnController]);
	//the directive
	function fnDirective(){
		return{
			'restrict':"AE",
			'replace': false,
			'templateUrl': "shield/app/components/header/header.html",
			'controller': "headerController",
			'controllerAs': "vm"
		};
	}
	//the controller
	function fnController(){

	}
})();
