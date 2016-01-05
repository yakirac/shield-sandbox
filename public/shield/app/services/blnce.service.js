;(function() {
	"use strict";
	// factory
	angular.module( "app.core" ).factory( "blnceService", fnService );

	function fnService( $http, $filter, localStorageService, $moment ) {
		var bService = this;
		bService.currentBalance = 100.00;
		bService.pastProjectedBalances = [];

		bService.calculateDaily = function( amount, month ) {
			var monthDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
			var d = new Date();
			return amount*monthDays[d.getMonth()];
		};

		bService.calculateWeekly = function( amount ) {
			return amount*4;
		};

		bService.calculateBiweekly = function( amount ) {
			return amount*2;
		};

		bService.calculateMonthly = function( amount ) {
			return amount;
		};

		return {
			validateUser				: fnValidateUser,
			loginUser					: fnLoginUser,
			registerUser				: fnRegisterUser,
			logoutUser					: fnLogoutUser,
			getCurrentUser				: fnGetCurrentUser,
			setCurrentUser				: fnSetCurrentUser,
			getUserSettings				: fnGetUserSettings,
			saveUserSettings			: fnSaveUserSettings,
			getTransactions 			: fnGetTransactions,
			getTransaction  			: fnGetTransaction,
			getProjectedBalance 		: fnGetProjectedBalance,
			calculateProjectedBalance 	: fnCalculateProjectedBalance,
			updateTransactions 			: fnUpdateTransactions
		};

		function fnValidateUser( email, password )
		{
			var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if( _.isEmpty( email ) && _.isEmpty( password ) ) return 'Please provide a valid email and password';
			if( _.isEmpty( email ) ) return 'Please provide a valid email address';
			if( !emailRegex.test( email ) ) return 'Please provide a valid email address';
			if( _.isEmpty( password ) ) return 'Please provide a valid password';

			return true;
		}

		function fnLoginUser( email, password )
		{

			var data = { 'username' : email, 'password' : password };
			return $http.post( '/blnce/login', data );
		}

		function fnRegisterUser( email, password )
		{
			var data = { 'username' : email, 'password' : password };
			return $http.post('/blnce/register', data);
		}

		function fnLogoutUser()
		{
			var data = {};
			var currentUser = fnGetCurrentUser();
			var config = { headers : { 'X-Auth-Token' : currentUser.token } };
			return $http.post('/blnce/logout', data, config);
		}

		function fnGetCurrentUser()
		{
			return bService.currentUser;
		}

		function fnSetCurrentUser( user )
		{
			bService.currentUser = user;
		}

		function fnGetUserSettings()
		{
			var currentUser = fnGetCurrentUser();
			var config = { headers : { 'X-Auth-Token' : currentUser.token } };
			return $http.get('/blnce/user/' + currentUser.id, config);
		}

		function fnSaveUserSettings( userData )
		{
			var currentUser = fnGetCurrentUser();
			var config = { headers : { 'X-Auth-Token' : currentUser.token } };
			return $http.put('/blnce/user', userData, config);
		}

		function fnGetTransactions() {

			bService.transactions = localStorageService.get( 'transactions' );
			if( bService.transactions === undefined || bService.transactions === null ) {
				//return $http.get('shield/app/data/transactionmonths.json')
				var currentBlnceUser = fnGetCurrentUser();
				return $http.get('/blnce/transactions', { headers : { 'X-Auth-Token' : currentBlnceUser.token } })
	                   .success(function( resp ){
	                        //cl( 'Data baby: ' + resp.response );
							bService.transactions = resp.response.transactions;
							//return fnCalculateProjectedBalance();
	                   }).error(function( error ){
	                        //$log.log('This is cray');
	                        //return 'This is cray';
							return error;
	                   });
			}

			return bService.transactions;
		}

		function fnGetTransaction( id ) {
			var transaction = bService.transactions.filter( function( transaction, idx ){
				if( transaction.id == id ) return transaction;
			});

			return transaction;
		}

		function fnGetCurrentBalance() {
			return 100.00;
		}

		function fnGetProjectedBalance() {
			return bService.projectedBalance;
		}

		//The projected balance for the month
		function fnCalculateProjectedBalance( recalculate, differentMonth ) {
			var transactionAmounts = 0;
			if( bService.transactions === undefined || recalculate ) bService.transactions = localStorageService.get( 'transactions' );
			var monthTransactions = getMonthTransactions( differentMonth );
			var amountCalcFns = { 'Daily' : 'calculateDaily', 'Weekly' : 'calculateWeekly', 'Bi-weekly' : 'calculateBiweekly', 'Monthly' : 'calculateMonthly' };
			monthTransactions.monthBalance = 0;
			monthTransactions.transactions.forEach(function( transaction, idx ){
				//console.log( 'Calculating balance: ', transaction );
				var amount = bService[ amountCalcFns[ getRecurringValue( transaction.details.recurringTypes ) ] ]( transaction.details.amount );
				//bService.currentBalance = transaction.transactionType == 1 ? bService.currentBalance - amount : bService.currentBalance + amount;
				monthTransactions.monthBalance = updateCurrentBalance( monthTransactions.monthBalance, transaction.transactionType, amount, differentMonth );
				transaction.remainingBalance = $filter( 'currency' )( monthTransactions.monthBalance );
				transaction.totalMonthlyAmount = amount;
			});

			bService.projectedBalance = monthTransactions.monthBalance;

			localStorageService.set( 'currentMonthTransactions', monthTransactions );
			fnUpdateTransactions();
			//localStorageService.set( 'transactions', bService.transactions );

			//return bService.transactions;
			return monthTransactions.transactions;
		}

		function getMonthTransactions( month ) {
			var transactionsMonth = month ? month.month : $moment().month();
			var transactionsYear = month ? month.year : $moment().year();
			//var newMonth = { month : transactionsMonth, year : transactionsYear, monthBalance : 0, transactions : [] };
			var newMonth = { userId : bService.currentUser.id, month : transactionsMonth, monthBalance : 0, transactions : [] };
			var monthTransactions = bService.transactions.filter( function( month, idx ) {
				//if( bService.transactions[idx].month == transactionsMonth && bService.transactions[idx].year == transactionsYear )
				if( bService.transactions[idx].month == transactionsMonth )
					return bService.transactions[idx];
			});
			return monthTransactions.length ? monthTransactions[0] : newMonth;
		}

		function fnUpdateTransactions() {
			//Get all of the transactions
			if( !bService.transactions || bService.transactions === undefined ) bService.transactions = localStorageService.get( 'transactions' );
			//Get the transactions of the current month we are looking at
			var currentMonthTransactions = localStorageService.get( 'currentMonthTransactions' );
			var foundIndex;
			//Try to find the current month in the list of months we have transactions for
			var transactions = bService.transactions.filter( function( month, idx ) {
				//if( currentMonthTransactions.month == bService.transactions[idx].month && currentMonthTransactions.year == bService.transactions[idx].year ) {
				if( currentMonthTransactions.month == bService.transactions[idx].month ) {
					foundIndex = idx;
					return { idenx : idx, found : false };
				}
			});
			//If we find one set the current index to the month we have updated with the added/edited transactions/
			//Otherwise add the new month to the list of transactions
			if( transactions[0] ) bService.transactions[foundIndex] = currentMonthTransactions;
			else bService.transactions.push( currentMonthTransactions );
			storeMonthTransactions( currentMonthTransactions );
			localStorageService.set( 'transactions', bService.transactions );
		}

		function storeMonthTransactions( monthTransactions )
		{
			$http.put('/blnce/transactions/' + monthTransactions.month, monthTransactions, { headers : { 'X-Auth-Token' : bService.currentUser.token } });
		}

		function updateCurrentBalance( currentBalance, transactionType, amount, differentMonth ) {
			//if( differentMonth !== undefined && !differentMonth.direction ) currentBalance = currentBalance - amount;
			/*else*/ currentBalance = transactionType == 1 ? currentBalance - amount : currentBalance + amount;

			return currentBalance;
		}

		function getRecurringValue( recurringTypes ) {
			var selectedType = recurringTypes.filter(function( t ){
				if( t.selected ) return t;
			});
			return !_.isUndefined(selectedType) ? selectedType[0].value : 'Daily';
		}
	}
})();
