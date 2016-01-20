(function() {
	"use strict";
	angular.module("app.shield.blnce").controller("blnceUserController", [ "$scope", "$timeout", "$filter", "blnceService", "PlaidService", "localStorageService", "appStatusService", "$moment", fnController ]);
	function fnController( $scope, $timeout, $filter, blnceService, PlaidService, localStorageService, AppStatusService, $moment ) {
		var blnceUser = this;
		blnceUser.userSettings = {};
		var currentBlnceUser = blnceService.getCurrentUser();
		blnceUser.showSettings = _.isUndefined( currentBlnceUser ) || _.isNull( currentBlnceUser ) ? false : true;
		blnceUser.appStatus = AppStatusService.isOnline() ? 'Blnce is online' : 'Blnce is offline';
		blnceUser.showMdl = false;

		getUser();

		function getUser()
		{
			blnceService.getUserSettings().then(function( resp ){
				blnceUser.userSettings = resp.data.response.settings;
			},function( error ){
				blnceUser.errorMessage = error.data.response.message;
			});
		}

		$scope.$on( 'blnceUser:updateshowmodal', updateShowModal );

		function updateShowModal( event, showModal )
		{
			blnceUser.showMdl = showModal;
		}

		blnceUser.loadModal = function( transaction ) {
			PlaidService.getInstitutions().then(function( resp ) {
				showModal( resp );
			}, function( error ){
				blnceUser.errorMessage = error.data.response.message;
			});
		};

		function showModal( resp )
		{
			blnceUser.showMdl = true;
			blnceUser.accountData = {
				institutions 	: resp.data.response.institutions,
				currentUser 	: currentBlnceUser,
				authDetails 	: {
					accountName : '',
					type 	 	: '',
					credentials : {
						username : '',
						password : '',
						pin		 : ''
					}
				}
			};
		}

		blnceUser.saveSettings = function()
		{
			blnceService.saveUserSettings( blnceUser.userSettings ).then(function( resp ){
				blnceUser.errorMessage = resp.data.response.message;
			},function( error ){
				blnceUser.errorMessage = error.data.response.message;
			});
		}

		blnceUser.applyToPlaid = function()
		{
			PlaidService.applyToPlaid().then(function( resp ){
				blnceUser.errorMessage = resp;
				cl( resp );
			},function( error ){
				blnceUser.errorMessage = error;
			});
		}


		return;
	}
}());
