(function() {
	"use strict";
    angular.module("app.core").controller( "blnceModalController", [ "$scope", "$modalInstance", "modelInfo", "localStorageService", fnModalController ] );

	function fnModalController( $scope, $modalInstance, modelInfo, localStorageService ){
		$scope.model = modelInfo.model;
		var collection = modelInfo.stype ? localStorageService.get( modelInfo.stype ) : [];

        $scope.selected_recurrence = getSelectedValue( 'recurringTypes' );

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

			//Update recurrence since it is nested.
            updatedSelectedValue( 'recurringTypes', $scope.selected_recurrence );

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
            modelInfo.parentScope.$emit( 'blnce:reload', { fromModal : true, month : sCollection.month, year : sCollection.year } );
		};

		$scope.range = function( num )
		{
			return new Array( num );
		};

		$scope.selectedValue = function( value, index )
		{
			return value == index+1 ? 'selected' : '';
		};

		function updatedSelectedValue( type, selectedValue ) {
			var detailsType = $scope.model.details[type];
			detailsType.forEach(function( detail, idx ){
				detail.selected = selectedValue == detail.id ? true : false;
			});
		}

        function getSelectedValue( modelType )
        {
            var selectedOption;
            var detailsType = $scope.model.details[modelType];
            detailsType.forEach(function( detail, idx ){
                if( detail.selected ) selectedOption = detail;
			});

            return selectedOption;
        }

        return;
	}
}());
