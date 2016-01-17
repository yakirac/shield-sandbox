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
	angular.module( 'app.core' ).directive( "shieldmodal", [ fnDirective ] );
	/**
	 * @ngdoc controller
	 * @name fnController
	 * @description
	 * This is the controller for this header
	 */
	angular.module("app.core").controller( "shieldModalController", [ "$scope", "$modal", fnController ] );
	//the directive
	function fnDirective(){
		return{
			'restrict':"AE",
			'replace': false,
			'scope' : { model : '=', sh : '=', modal : '@', stype : '@', ctype : '@' },
			'templateUrl': "shield/app/components/modal/shieldModal.html",
			'controller': "shieldModalController",
			'controllerAs': "vm"
		};
	}
	//the controller
	function fnController( $scope, $modal ){
		var vm = this;

		$scope.$watch('sh', function(n, o, scope){
			vm.showModal( n );
		});

		vm.showModal = function( show )
		{
			if( show )
			{
				var modalInstance = $modal.open({
				      animation: false,
				      templateUrl: 'shield/app/components/modal/' + $scope.modal + '-modal/' + $scope.modal + '.modal.html',
					  controller: $scope.modal + 'ModalController',
				      size: 'lg',
				      resolve: {
						  modelInfo : function(){
							  return { model : $scope.model, stype : $scope.stype, ctype : $scope.ctype, parentScope : $scope };
						  }
					  }
			  	});
			}
		};
	}
})();
