(function() {
	"use strict";
    angular.module("app.core").controller( "mmuModalController", [ "$scope", "$modalInstance", "modelInfo", fnModalController ] );

    function fnModalController( $scope, $modalInstance, modelInfo, localStorageService ){
        $scope.model = modelInfo.model;
        $scope.cls = function(){
            modelInfo.parentScope.sh = false;
            $modalInstance.dismiss('cancel');
        };

        return;
    }
}());
