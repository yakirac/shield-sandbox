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
	angular.module("app.core").controller( "cModalController", [ "$scope", "$modal", fnController ] );
	//the directive
	function fnDirective(){
		return{
			'restrict':"AE",
			'replace': false,
			'scope' : { model : '=', sh : '=', tmpl : '@', stype : '@', ctype : '@' },
			'templateUrl': "shield/app/components/modal/cModal.html",
			'controller': "cModalController",
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
				      templateUrl: 'shield/app/components/modal/' + $scope.tmpl + '.modal.html',
					  controller: 'modalController',
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

	angular.module("app.core").controller( "modalController", [ "$scope", "$modalInstance", "modelInfo", "localStorageService", fnModalController ] );

	function fnModalController( $scope, $modalInstance, modelInfo, localStorageService ){
		$scope.model = modelInfo.model;
		var collection = modelInfo.stype ? localStorageService.get( modelInfo.stype ) : [];

		$scope.cls = function(){
			modelInfo.parentScope.sh = false;
			$modalInstance.dismiss('cancel');
		};

		$scope.sve = function(){
			var modelFound = false;
			if( modelInfo.stype && modelInfo.ctype ) collection = collection[ modelInfo.ctype ];
			collection.forEach( function( model, idx ){
				if( model.id == $scope.model.id ) collection[idx] = $scope.model;
				modelFound = model.id == $scope.model.id && !modelFound ? true : false;
			});

			//Update recurrence since it is nested. Figure out how to set it as the ng-model later
			var recurrence = angular.element( document.getElementById('recurrence') );
			updatedSelectedValue( $scope.model, 'recurringTypes', parseInt( recurrence.val() ) );

			if( !modelFound )
			{
				$scope.model.id = collection.length+1;
				collection.push( $scope.model );
			}
			var sCollection = localStorageService.get( modelInfo.stype );
			if( modelInfo.stype && modelInfo.ctype ) sCollection[ modelInfo.ctype ] = collection;
			localStorageService.set( modelInfo.stype, modelInfo.stype && modelInfo.ctype ? sCollection : collection );

			modelInfo.parentScope.sh = false;
			$modalInstance.dismiss('cancel');
			modelInfo.parentScope.$parent.blnce.reload( true, { month : sCollection.month, year : sCollection.year });
		};

		$scope.range = function( num )
		{
			return new Array( num );
		};

		$scope.selectedValue = function( value, index )
		{
			return value == index+1 ? 'selected' : '';
		};

		function updatedSelectedValue( model, type, selectedValue ) {
			var detailsType = model.details[type];
			detailsType.forEach(function( detail, idx ){
				detail.selected = selectedValue == detail.id ? true : false;
			});
		}

		$scope.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
	}
})();
