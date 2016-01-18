(function() {
	"use strict";

    /*
        BLNCE NEW ACCOUNT MODAL
    */
    angular.module("app.core").controller( "blnceaccntModalController", [ "$scope", "$modalInstance", "modelInfo", "PlaidService", "localStorageService", fnModalController ] );

	function fnModalController( $scope, $modalInstance, modelInfo, PlaidService, localStorageService ){
		$scope.model = modelInfo.model;
		var collection = modelInfo.stype ? localStorageService.get( modelInfo.stype ) : [];

		$scope.showPin = false;

		$scope.fields = { username : 'Username', password : 'Password', pin : 'Pin' };

		$scope.saveText = 'Save';
		$scope.errorMessage = '';

		$scope.cls = function(){
			modelInfo.parentScope.$emit( 'blnceUser:updateshowmodal', false );
			$modalInstance.dismiss('cancel');
		};

		$scope.sve = function(){
			//console.log( $scope.model );
			PlaidService.addAccount($scope.model.authDetails, $scope.model.currentUser.token).then(function( data ){
				if( !$scope.bank.has_mfa )
				{
					modelInfo.parentScope.$emit( 'blnceUser:updateshowmodal', false );
					$modalInstance.dismiss('cancel');
					return;
				}
				$scope.mfa = true;
				cl( data );
			}, function( error ){
				$scope.errorMessage = error.data.response.message;
			});
		};

        $scope.updateFields = function(){
            var bankObj = _.where( $scope.model.institutions, { type : $scope.model.authDetails.type });
			if( bankObj.length )
			{
				$scope.bank = bankObj[0];
				$scope.fields = $scope.bank.credentials;
				$scope.showPin = !_.isUndefined( $scope.fields.pin ) ? true : false;
				$scope.saveText = $scope.bank.has_mfa ? 'Next' : 'Save';
			}
        };

        return;
	}
}());
