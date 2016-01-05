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
	angular.module( 'app.core' ).directive( "footer", fnDirective );
	/**
	 * @ngdoc controller
	 * @name fnController
	 * @description
	 * This is the controller for this header
	 */
	angular.module("app.core").controller("footerController", [fnController]);
	//the directive
	function fnDirective(){
		return{
			'restrict':"AE",
			'replace': false,
			'templateUrl': "shield/app/components/footer/footer.html",
			'controller': "footerController",
			'controllerAs': "vm"
		};
	}
	//the controller
	function fnController(){

	}
})();
