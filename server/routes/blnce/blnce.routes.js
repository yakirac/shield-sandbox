(function() {
	"use strict";

	var blnceUserService = require('./blnce.user.service');
	var blnceTransactionsService = require('./blnce.transactions.service');
	var blncePlaidService = require('./blnce.plaid.service');
	var _ = require('lodash');
	var db = require('../../configs/db');

	function setBlnceRoutes(app)
	{

		setBlnceAccessRoutes(app);
		setPlaidDataRoutes(app);
		setTransactionRoutes(app);
		setBlnceUserRoutes(app);

		db.createDatabaseConnection('test');

	}

	function setBlnceAccessRoutes(app)
	{
		//Log the user in to blnce
		//Expecting a username and password to be provided
		app.post('/blnce/login', function(req, res){
			//Log the user in creating an auth token
			blnceUserService.loginUser( req.body, res );
		});

		app.post('/blnce/register', function(req, res){
			//register the user
			blnceUserService.registerUser( req.body, res );
		});

		//Log the user out of blnce
		app.post('/blnce/logout', function(req, res){
			//Logout the user
			var authToken = req.headers['x-auth-token'];
			blnceUserService.logoutUser( authToken, res );
		});
	}

	function setPlaidDataRoutes(app)
	{
		//Get the possible categories for transactions
		app.get('/blnce/categories', function(req, res){
			//Get Categories
			blncePlaidService.getPlaidCategories( res );
		});

		//Get the bank institutions available to connect to
		app.get('/blnce/institutions', function(req, res){
			//Get Institutions
			blncePlaidService.getPlaidInstitutions( res );
		});

		app.get('/blnce/institutions/longtail', function(req, res){
			//Get Institutions
			blncePlaidService.getPlaidInstitutionsLongtail( res );
		});

		app.post('/blnce/connect-account', function(req, res){
			//Start the process to add a new bank account for the user
			var data = { authDetails : req.body, authToken : req.headers['x-auth-token'] };
			blncePlaidService.addPlaidConnectUser( data, res );
		});

		app.post('/blnce/connect-verify-account', function(req, res){
			//Start the process to add a new bank account for the user
			var data = { authDetails : req.body, authToken : req.headers['x-auth-token'] };
			blncePlaidService.resolveMFA( data, res );
		});
	}

	function setTransactionRoutes(app)
	{
		/*** ALL TRANSACTIONS ***/
		//Get all the transactions
		app.get('/blnce/transactions', function(req, res){
			var data = { authToken : req.headers['x-auth-token'] };
			//get the transactions
			blnceTransactionsService.getAllUserTransactions( data, res );
		});

		/*** MONTH TRANSACTIONS ***/

		//Get the transactions for a month
		app.get('/blnce/transactions/:month', function(req, res){
			var data = { month : req.params.month, authToken : req.headers['x-auth-token'] };
			//get the transactions
			blnceTransactionsService.getMonthTransactions( data, res );
		});

		//Save the new transaction to the month's transactions
		app.post('/blnce/transactions/:month', function(req, res){
			var data = { month : req.params.month, transaction : req.body, authToken : req.headers['x-auth-token'] };
			//Save the transaction to the month
			blnceTransactionsService.addMonthTransaction( data, res );
		});

		//Update the the month's transactions
		app.put('/blnce/transactions/:month', function(req, res){
			var data = { month : req.params.month, monthTransactions : req.body, authToken : req.headers['x-auth-token'] };
			//Save the transaction updates
			blnceTransactionsService.saveMonthTransactions( data, res );
		});

		/*** SINGLE MONTH TRANSACTION ***/

		//Get a single transaction for a month
		app.get('/blnce/transactions/:month/:id', function(req, res){
			var data = { month : req.params.month, id : req.params.id, authToken : req.headers['x-auth-token'] };
			//get the transaction
			blnceTransactionsService.getMonthTransaction( data, res );
		});

		//Delete a single transaction for a month
		//IMPLEMENT LATER. Right now the saving scheme does not call for this.
		/*app.delete('/blnce/transactions/:month/:id', function(req, res){
			//Delete transaction
		});*/
	}

	function setBlnceUserRoutes(app)
	{
		app.get('/blnce/user/:id', function(req, res){
			//get the user
			var data = { userId : req.params.id, authToken : req.headers['x-auth-token'] };
			blnceUserService.getUser( data, res );
		});

		app.put('/blnce/user/:id', function(req, res){
			//update the data
			var data = { userId : req.params.id, user : req.body, authToken : req.headers['x-auth-token'] };
			blnceUserService.saveUser( data, res );
		});

	}

	module.exports = setBlnceRoutes;
}());
