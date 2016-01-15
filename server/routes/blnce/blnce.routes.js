(function() {
	"use strict";

	var blnceUserService = require('./blnce.user.service');
	var blnceTransactionsService = require('./blnce.transactions.service');
	var plaid = require('plaid');
	var _ = require('lodash');
	var config = require('../../configs/config');
	var db = require('../../configs/db');

	var plaid_env = plaid.environments[config.plaid_env];

	var currentUser;

	function setBlnceRoutes(app)
	{

		setBlnceAccessRoutes(app);
		setGeneralDataRoutes(app);
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

	function setGeneralDataRoutes(app)
	{
		//Get the bank institutions available to connect to
		app.get('/blnce/institutions', function(req, res){
			//Get Institutions
			/*plaid.getInstitutions( plaid_env, function( error, result ){
				res.json({ "id" : 2, "plaid" : result, "config.plaid_env" : config.plaid_env });
			});*/
		});

		//Get the possible categories for transactions
		app.get('/blnce/categories', function(req, res){
			//Get Categories
			/*plaid.getCategories( plaid_env, function( error, result ){
				res.json({ "id" : 2, "plaid" : result });
			});*/
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
