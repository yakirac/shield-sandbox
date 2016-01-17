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
		$scope.hero = $scope.hero;
		$scope.showImage = false;
		$scope.showPlaceholder = true;
		$scope.showHeroImage = showHeroImage;
		$scope.hideHeroImage = hideHeroImage;
		$scope.showHeroInfoModal = showHeroInfoModal;

		function showHeroImage(){
			//cl( 'Showing' );
			$scope.showImage = true;
			$scope.showPlaceholder = false;
		}

		function hideHeroImage(){
			//cl( 'Hiding' );
			$scope.showImage = false;
			$scope.showPlaceholder = true;
		}

		function showHeroInfoModal( hero ){
			$scope.$emit('characters:showmodal', hero);
		}
	}
})();
