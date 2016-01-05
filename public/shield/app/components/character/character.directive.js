;(function(){
	'use strict';
	/**
	* @ngdoc directive
	* @name global.directive:character.directive
	* @scope
	* @restrict E
	*
	* @description
	* this will output the individual character
	*
	*/
	angular.module( 'app.core' ).directive( "character", [ fnDirective ] );
	/**
	 * @ngdoc controller
	 * @name fnController
	 * @description
	 * This is the controller for a character
	 */
	angular.module("app.core").controller( "characterController", [ "$scope", "heroService", fnController ] );
	//the directive
	function fnDirective(){
		return{
			'restrict':"AE",
			'replace': true,
			'scope' : { hero : '=' },
			'templateUrl': "shield/app/components/character/character.html",
			'controller': "characterController",
			'controllerAs': "vm"
		};
	}
	//the controller
	function fnController( $scope, heroService ){
		var vm = this;
		vm.hero = $scope.hero;
		vm.showImage = false;
		vm.showPlaceholder = true;
		vm.showHeroImage = showHeroImage;
		vm.hideHeroImage = hideHeroImage;
		vm.showHeroInfoModal = showHeroInfoModal;

		function showHeroImage(){
			//cl( 'Showing' );
			vm.showImage = true;
			vm.showPlaceholder = false;
		}

		function hideHeroImage(){
			//cl( 'Hiding' );
			vm.showImage = false;
			vm.showPlaceholder = true;
		}

		function showHeroInfoModal( hero ){
			$scope.$parent.vm.showHeroInfoModal( hero );
		}
	}
})();
