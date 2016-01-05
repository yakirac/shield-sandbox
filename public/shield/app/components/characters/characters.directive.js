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
			'restrict':"AE",
			'replace': false,
			'templateUrl': "shield/app/components/characters/characters.html",
			'controller': "charactersController",
			'controllerAs': "vm"
		};
	}
	//the controller
	function fnController( $scope, heroService ){
		var vm = this;

		vm.sh = false;
		vm.hero = '';

		vm.heros = [];
		heroService.getHeros().then(function( data ){
			vm.heros = data.data;
			//cl( vm.heros );
		}, function( error ){
			cl( error );
		});

		vm.showHeroInfoModal = function( hero )
		{
			//cl( hero );
			vm.sh = true;
			vm.tmpl = 'mmu';
			vm.hero = hero;
		};
	}
})();
