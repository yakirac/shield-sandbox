;(function(){
	'use strict';
	/**
	* @ngdoc directive
	* @name global.directive:characters.directive
	* @scope
	* @restrict E
	*
	* @description
	* this will output a list of characters
	*
	*/
	angular.module( 'app.core' ).directive( "characters", [ fnDirective ] );
	/**
	 * @ngdoc controller
	 * @name fnController
	 * @description
	 * This is the controller for this directive
	 */
	angular.module("app.core").controller( "charactersController", [ "$scope", "heroService", fnController ] );
	//the directive
	function fnDirective(){
		return{
			restrict:"AE",
			replace: false,
			templateUrl: "shield/app/components/characters/characters.html",
			controller: "charactersController",
			controllerAs: "vm"
		};
	}
	//the controller
	function fnController( $scope, heroService ){
		$scope.sh = false;
		$scope.hero = '';

		$scope.heros = [];
		heroService.getHeros().then(function( data ){
			$scope.heros = data.data;
			//cl( vm.heros );
		}, function( error ){
			cl( error );
		});

		$scope.$on( 'characters:showmodal', showHeroInfoModal );

		function showHeroInfoModal( event, hero )
		{
			//cl( hero );
			$scope.sh = true;
			$scope.tmpl = 'mmu';
			$scope.hero = hero;
		};
	}
})();
