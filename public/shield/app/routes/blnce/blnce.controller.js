(function() {
	"use strict";
	angular.module("app.shield.blnce").controller("blnceController", [ "$scope", "$timeout", "$filter", "blnceService", "localStorageService", "appStatusService", "$moment", fnController ]);
	function fnController( $scope, $timeout, $filter, blnceService, localStorageService, AppStatusService, $moment ) {
		var blnce = this;
		var u = blnceService.getCurrentUser();
		blnce.showApp = !_.isNull( u ) && !_.isUndefined( u ) ? true : false;
		blnce.showMdl = false;
		blnce.editMode = false;
		blnce.transactionsToDelete = [];
		blnce.date = $moment();
		blnce.currentMonth = $moment().month();
		blnce.currentMonthCalculating = blnce.currentMonth;
		blnce.calculatedMonth = getMonthCalculating( blnce.currentMonthCalculating );
		blnce.year = blnce.date.year();
		blnce.allowPreviousMonth = false;
		blnce.appStatus = AppStatusService.isOnline() ? 'Blnce is online' : 'Blnce is offline';

		blnce.signin = function() {
			var email = angular.element( document.getElementById( 'email' ) );
			var password = angular.element( document.getElementById( 'password' ) );
			var isLoginValid = blnceService.validateUser( email.val(), password.val() );
			if( isLoginValid === true )
			{
				var prms = blnceService.loginUser( email.val(), password.val() );
				prms.then( function( resp ) {
					var currentBlnceUser = resp.data.response.user;
					currentBlnceUser.token = resp.headers('X-Auth-Token');
					blnceService.setCurrentUser( currentBlnceUser );
					loadTransactions();
					blnce.errorMessage = '';
				}, function( error ) {
					blnce.errorMessage = error.data.response.message;
				});
			}
			else blnce.errorMessage = isLoginValid;
		};

		function loadTransactions()
		{
			blnce.transactions = localStorageService.get('transactions');
			if( blnce.transactions === undefined || blnce.transactions === null ) {
				blnceService.getTransactions().then(function( data ){
					blnce.transactions = blnceService.calculateProjectedBalance();
					//console.log( 'Controller load transactions', blnce.transactions );
					blnce.projectedBalance = $filter( 'currency' )( blnceService.getProjectedBalance() );
					blnce.showApp = true;
					blnce.errorMessage = '';
				}, function( error ){
					cl( error );
					blnce.errorMessage = error.data.response.message;
				});
			}else {
				blnce.transactions = blnceService.calculateProjectedBalance();
				blnce.projectedBalance = $filter( 'currency' )( blnceService.getProjectedBalance() );
				_.defer(function(){
					$scope.$apply( function() {
						blnce.showApp = true;
					});
				});
			}
		}

		blnce.signup = function() {
			var email = angular.element( document.getElementById( 'email' ) );
			var password = angular.element( document.getElementById( 'password' ) );
			var isRegistrationValid = blnceService.validateUser( email.val(), password.val() );
			if( isRegistrationValid === true )
			{
				var prms = blnceService.registerUser( email.val(), password.val() );
				prms.then( function( resp ) {
					var currentBlnceUser = resp.data.response.user;
					currentBlnceUser.token = resp.headers('X-Auth-Token');
					blnceService.setCurrentUser( currentBlnceUser );
					loadTransactions();
					blnce.errorMessage = '';
				}, function( error ) {
					//alert( 'We were not able to create the user : ' +  error.message );
					blnce.errorMessage = error.data.response.message;
				});
			}
			else blnce.errorMessage = isRegistrationValid;
		};

		blnce.signout = function() {
			var prms = blnceService.logoutUser();
			prms.then( function( resp ) {
				blnceService.setCurrentUser( null );
				blnce.showApp = false;
				blnce.errorMessage = '';
			}, function( error ) {
				//alert( 'We were not able to log you out : ' + error.message );
				blnce.errorMessage = error.data.response.message;
			});
		};

		blnce.formatTransactionAmount = function( amount, type ) {
			var debitsCredits = { '1' : '-', '2' : '+' };
			return debitsCredits[type] + $filter( 'currency' )( amount );
		};

		blnce.getTransactionStyle = function( type ) {
			var transactionStyles = { '1' : { color : '#ff0000' }, '2' : { color : '#008000' } };
			return transactionStyles[type];
		};

		blnce.getBalanceStyle = function( amount ) {
			return amount && amount.indexOf('(') > -1 ? { color : '#ff0000' } : { color : '#008000' };
		};

		blnce.getRecurringTypeSymbol = function( recurringTypes ) {
			//var recurringSymbols = { '1' : 'D', '2' : 'W', '3' : 'BW', '4' : 'M' };
			var selectedType = recurringTypes.filter(function( t ){
				if( t.selected ) return t;
			});

			return selectedType ? selectedType[0].symbol : 'D';
		};

		blnce.showModal = function( transaction ) {
			blnce.showMdl = true;
			blnce.tmpl = 'blnc';
			if( transaction !== undefined ) blnce.transaction = transaction;
			else blnce.transaction = { "recurring" : true,
			"recurringYear" : blnce.year,
			"transactionType" : 1,
	        "details" : {
	            "company" : "",
	            "description" : "",
	            "recurringTypes" : [ { "id" : 1, "selected" : true, "symbol" : "D", "value" : "Daily" }, { "id" : 2, "selected" : false, "symbol" : "W", "value" : "Weekly" }, { "id" : 3, "selected" : false, "symbol" : "BW", "value" : "Bi-weekly" }, { "id" : 4, "selected" : false, "symbol" : "M", "value" : "Monthly" } ],
	            "recurringDay" : { "dayOfMonth" : 0, "dayOfWeek" : "" },
	            "amount" : 0
	        }};
		};

		blnce.reload = function( fromModal, differentMonth ) {
			if( fromModal ) {
				cl( localStorageService.get('currentMonthTransactions') );
				updateTransactions();
				$timeout(function () {
					setReloadTransactionData( differentMonth );
				}, 10);
			} else {
				setReloadTransactionData( differentMonth );
			}
		};

		function setReloadTransactionData( differentMonth )
		{
			blnce.transactions = blnceService.calculateProjectedBalance( true, differentMonth );
			blnce.projectedBalance = $filter( 'currency' )( blnceService.getProjectedBalance() );
			blnce.transactionsToDelete = [];
		}

		blnce.edit = function() {
			blnce.editMode = blnce.editMode ? false : true;
			var blnceData = angular.element( document.getElementsByClassName( 'blnce-list-data' ) );

			blnceData.css( 'padding-left', blnce.editMode ? '20px' : '0px' );

			var editBtn = angular.element( document.getElementById( 'edit') );

			editBtn.html( blnce.editMode ? 'Delete Selected' : 'Edit' );

			editBtn.parent().css( { 'border-color' : blnce.editMode ? 'red' : '#ccc', 'margin-top' : blnce.editMode ? '5px' : '0px' } );

			if( !blnce.editMode ) deleteTransactions( blnce.transactionsToDelete );

		};

		blnce.setDelete = function( transaction ) {
			var transSpan = angular.element( document.getElementById( 'trans-' + transaction.id ) );
			var inDelete = transSpan.hasClass( 'red' );
			if( !inDelete ) blnce.transactionsToDelete.push( transaction );
			else removeTransaction( transaction );

			function removeTransaction( transaction ) {
				for (var idx in blnce.transactionsToDelete ) {
					if( blnce.transactionsToDelete[idx].id == transaction.id )
						blnce.transactionsToDelete.splice( idx, 1 );
				}
			}

			transSpan[ (transSpan.hasClass( 'red' ) ? 'remove' : 'add') + 'Class' ]( 'red' );
		};

		blnce.calculatePreviousMonth = function() {
			blnce.date = blnce.date.subtract( 1, 'months' );
			blnce.currentMonthCalculating = blnce.date.month();
			blnce.calculatedMonth = getMonthCalculating( blnce.currentMonthCalculating );
			blnce.year = blnce.date.year();
			blnce.allowPreviousMonth = blnce.checkMonth() ? false : true;

			updateTransactions();

			var calculationData = { direction : 0, month : blnce.currentMonthCalculating, year : blnce.year, currentMonth : blnce.checkMonth() };
			blnce.reload( false, calculationData );
		};

		blnce.calculateNextMonth = function() {
			blnce.date = blnce.date.add( 1, 'months' );
			blnce.currentMonthCalculating = blnce.date.month();
			blnce.calculatedMonth = getMonthCalculating( blnce.currentMonthCalculating );
			blnce.year = blnce.date.year();
			blnce.allowPreviousMonth = blnce.checkMonth() ? false : true;

			updateTransactions();

			var calculationData = { direction : 1, month : blnce.currentMonthCalculating, year : blnce.year, currentMonth : blnce.checkMonth() };
			blnce.reload( false, calculationData );
		};

		blnce.checkMonth = function() {
			return blnce.currentMonth == blnce.currentMonthCalculating && blnce.year == $moment().year() ? true : false;
		};


		function getMonthCalculating( month ) {
			var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

			return months[ month ];
		}

		function updateTransactions() {
			blnceService.updateTransactions();
		}

		function deleteTransactions( transactions ) {
			//Come back and redo with JS function
			for (var idx in blnce.transactions ) {
				for( var idxt in blnce.transactionsToDelete )
				{
					if( blnce.transactionsToDelete[idxt].id == blnce.transactions[idx].id )
						blnce.transactions.splice( idx, 1 );
				}
			}
			//Grab the current month transaction details
			var currentMonthTransactions = localStorageService.get( 'currentMonthTransactions' );
			//Set the transactions for the current month to our edited transactions
			currentMonthTransactions.transactions = blnce.transactions;
			//Set the currentMonthTransactions to the updated model
			localStorageService.set( 'currentMonthTransactions', currentMonthTransactions );
			//localStorageService.set( 'transactions', blnce.transactions );
			blnceService.updateTransactions();

			var calculationData = { month : blnce.currentMonthCalculating, year : blnce.year, currentMonth : blnce.checkMonth() };
			blnce.reload( false, calculationData );
		}

		//"recurringTypes" : { "1" : false, "2" : false, "3" : true }
		//1 - Daily, 2 - Weekly, 3 - Monthly

		//"tranasctionType" : 1, 2
		//1 - Debit, 2 - Credit

		return;
	}
}());
