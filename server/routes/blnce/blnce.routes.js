(function() {
	"use strict";

	//mongoose
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
			var response = blnceUserService.loginUser( req.body );

			if( _.isUndefined( response.status) )
			{
				response.then(function(re){
					var resp = { status : 'success', message : 'User is now logged in', user : { id : re._id } };
					if( _.isUndefined( re.status ) )
					{
						res.set('X-Auth-Token', re.token);
						res.status(200).json({ "result" : "Log In User", "response" : resp });
					}
					else res.status(404).json({ "result" : "Log In User", "response" : re });
				});
			}
			else res.status(400).json({ "result" : "Log In User", "response" : response });

		});

		app.post('/blnce/register', function(req, res){
			//register the user
			var response = blnceUserService.registerUser( req.body );
			if( _.isUndefined(response.status) )
			{
				response.then( function(re){
					var resp = { status : 'success', message : 'New user registered', user : { id : re._id } };
					if( _.isUndefined( re.status ) )
					{
						res.set('X-Auth-Token', re.token);
						res.status(200).json({ "result" : "Register New User", "response" : resp });
					}
					else res.status(404).json({ "result" : "Register New User", "response" : re });
				});
			}
			else res.status(400).json({ "result" : "Register New User", "response" : response });

		});

		//Log the user out of blnce
		app.post('/blnce/logout', function(req, res){
			//Logout the user
			var authToken = req.headers['x-auth-token'];
			var response = blnceUserService.logoutUser(authToken);
			response.then( function(re){
				var resp = { status : 'success', message : 'The user has been successfully logged out', user : [] };
				if( _.isUndefined( re.status ) )
				{
					res.set('X-Auth-Token', '');
					res.status(200).json({ "result" : "Log Out User", "response" : resp });
				}
				else res.status(404).json({ "result" : "Log Out User", "response" : re });
			});
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
		//Get all the transactions
		app.get('/blnce/transactions', function(req, res){
			var data = { authToken : req.headers['x-auth-token'] };
			//get the transactions
			var response = blnceTransactionsService.getAllUserTransactions( data );
			response.then( function(re){
				if( _.isUndefined( re.status ) )
				{
					var resp = { status : 'success', message : 'Transactions retrieved successfully', transactions : re };
					res.status(200).json({ "result" : "Get Transactions", "response" : resp });
				}
				res.status(500).json({ "result" : "Get Transactions", "response" : re });
			});
		});

		//Get the transactions for a month
		app.get('/blnce/transactions/:month', function(req, res){
			var data = { month : req.params.month, authToken : req.headers['x-auth-token'] };
			//get the transactions
			var response = blnceTransactionsService.getMonthTransactions( data );
			response.then( function(re){
				if( _.isUndefined( re.status ) )
				{
					var resp = { status : 'success', message : 'Transactions retrieved successfully', transactions : re };
					res.status(200).json({ "result" : "Get Month Transactions", "response" : resp });
				}
				res.status(500).json({ "result" : "Get Month Transactions", "response" : re });
			});
		});

		//Get a single transaction for a month
		app.get('/blnce/transactions/:month/:id', function(req, res){
			var data = { month : req.params.month, id : req.params.id, authToken : req.headers['x-auth-token'] };
			//get the transaction
			var response = blnceTransactionsService.getMonthTransaction( data );
			response.then( function(re){
				if( _.isUndefined( re.status ) )
				{
					var resp = { status : 'success', message : 'Transaction retrieved successfully', transactions : re };
					res.status(200).json({ "result" : "Get Transaction", "response" : resp });
				}
				res.status(500).json({ "result" : "Get Transaction", "response" : re });
			});
		});

		//Save the new transaction to the month's transactions
		app.post('/blnce/transactions/:month', function(req, res){
			var data = { month : req.params.month, authToken : req.headers['x-auth-token'] };
			//Save the transaction to the month
			var response = blnceTransactionsService.addMonthTransaction( data );
			response.then( function(re){
				if( _.isUndefined( re.status ) )
				{
					var resp = { status : 'success', message : 'Transaction added successfully', transaction : re };
					res.status(200).json({ "result" : "Add New Month Transaction", "response" : resp });
				}
				res.status(500).json({ "result" : "Add New Month Transaction", "response" : re });
			});
		});

		//Update the the month's transactions
		app.put('/blnce/transactions/:month', function(req, res){
			var data = { month : req.params.month, monthTransactions : req.body, authToken : req.headers['x-auth-token'] };
			//Save the transaction updates
			var response = blnceTransactionsService.saveMonthTransactions( data );
			response.then( function(re){
				if( _.isUndefined( re.status ) )
				{
					var resp = { status : 'success', message : 'Transactions saved successfully', transaction : re };
					res.status(200).json({ "result" : "Save Month Transactions", "response" : resp });
				}
				res.status(500).json({ "result" : "Save Month Transactions", "response" : re });
			});
		});

		//Delete a single transaction for a month
		//IMPLEMENT LATER. Right now the saving scheme does not call for this.
		/*app.delete('/blnce/transactions/:month/:id', function(req, res){
			//Delete transaction

			res.json({ "result" : "Deleted"});
		});*/
	}

	function setBlnceUserRoutes(app)
	{
		app.get('/blnce/user/:id', function(req, res){
			//get the user
			var data = { userId : req.params.id, authToken : req.headers['x-auth-token'] };
			var response = blnceUserService.getUser( data );
			response.then( function(re){
				if( _.isUndefined( re.status ) )
				{
					var resp = { status : 'success', message : 'User retrieved successfully', settings : re };
					res.status(200).json({ "result" : "Get User", "response" : resp });
				}
				res.status(500).json({ "result" : "Get User", "response" : re });
			});
		});

		app.put('/blnce/user/:id', function(req, res){
			//update the data
			var data = { userId : req.params.id, user : req.body, authToken : req.headers['x-auth-token'] };
			var response = blnceUserService.saveUser( data );
			response.then( function(re){
				if( _.isUndefined( re.status ) )
				{
					var resp = { status : 'success', message : 'User saved successfully', settings : re };
					res.status(200).json({ "result" : "Save User", "response" : resp });
				}
				res.status(500).json({ "result" : "Save User", "response" : re });
			});
		});

	}

	module.exports = setBlnceRoutes;
}());
