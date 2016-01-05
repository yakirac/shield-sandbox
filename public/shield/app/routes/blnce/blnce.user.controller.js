(function() {
	"use strict";
	angular.module("app.shield.blnce").controller("blnceUserController", [ "$scope", "$timeout", "$filter", "blnceService", "localStorageService", "appStatusService", "$moment", fnController ]);
	function fnController( $scope, $timeout, $filter, blnceService, localStorageService, AppStatusService, $moment ) {
		var blnceUser = this;
		blnceUser.userSettings = {};
		var currentBlnceUser = blnceService.getCurrentUser();
		blnceUser.showSettings = _.isUndefined( currentBlnceUser ) || _.isNull( currentBlnceUser ) ? false : true;
		blnceUser.appStatus = AppStatusService.isOnline() ? 'Blnce is online' : 'Blnce is offline';

		getUser();

		function getUser()
		{
			blnceService.getUserSettings().then(function( resp ){
				blnceUser.userSettings = resp.data.response.settings;
			},function( error ){
				blnceUser.errorMessage = error.data.response.message;
			});
		}

		blnceUser.saveSettings = function()
		{
			/*blnceService.saveUserSettings().then(function(){

			},function( error ){
				blnceUser.errorMessage = error.data.response.message;
			});*/
		}


		return;
	}
}());
