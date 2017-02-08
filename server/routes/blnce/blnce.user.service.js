(function() {
	"use strict";

    var db;
	var _ = require('lodash');
	var mongoose = require('mongoose');
	var User = require('./blnce.user.model');
    //var database = require('../../configs/db');

    function initialize()
    {
        //db = database.createDatabaseConnection('test');
    }

    //USER SERVICES

    function parseRequest(request) {
    	var requestParams = {};
    	if(Object.keys(request).length) {
    		requestParams = JSON.parse(Object.keys(request)[0]);
    	}
    	return requestParams;
    }

	function validateUser( username, password )
	{
		if( _.isEmpty( username ) && _.isEmpty( password ) ) return 'The credentials entered were invalid';
		if( _.isEmpty( username ) ) return 'Please provide a valid email address';
		if( _.isEmpty( password ) ) return 'Please provide a valid password';

		return true;
	}

	function generateAuthToken()
	{
		var authToken = '';
		var charString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		do {
			var c = charString[Math.floor(Math.random()*charString.length)];
			authToken += c;
		} while( authToken.length < 16 );

		return authToken;
	}

	function sendDatabaseResponse( err, responseData )
	{
		var tokenActions = ['Log In User', 'Register New User', 'Log Out User'];
		var userActions = ['Get User', 'Save User'];
		if( err ) return handleResponse({ res : this.res, status : 400, action : this.action, message : err.message, data : this.data });
		if( _.contains(tokenActions, this.action) ) this.res.set('X-Auth-Token', responseData.token);
		if( this.action == 'Register New User' ) this.data.user.id = responseData._id;
		if( _.contains(userActions, this.action ) ) this.data.settings = responseData;
		handleResponse({ res : this.res, status : 200, action : this.action, message : this.message, data : this.data });
	}

	function handleResponse( responseData )
	{
		var response = _.extend({}, { status : responseData.status, message : responseData.message }, responseData.data );
		responseData.res.status( responseData.status ).json({ "action" : responseData.action, "response" : response });
	}

    function fnLoginUser( request, res )
    {
		var loginParams = parseRequest( request );
		var isValidLogin = validateUser( loginParams.username, loginParams.password );

		if( isValidLogin !== true )
		{
			handleResponse( { res : res, status : 400, action : 'Log In User', message : isValidLogin, data : {} } );
			return;
		}
		var query = User.findOne({ username : loginParams.username, password : loginParams.password });
		query.exec().then(function(user){
			if( _.isEmpty( user ) )
			{
				handleResponse( { res : res, status : 404, action : 'Log In User', message : 'The user you are trying to login as could not be found. Please check your credentials.', data : { user : user } } );
				return;
			} 
			var token = generateAuthToken();
			user.token = token;
			if( _.isUndefined(user.notificationSettings.email) ) user.notificationSettings = { email : false };
			user.save( sendDatabaseResponse.bind({ res : res, action : 'Log In User', message : 'User is now logged in', data : { user : { id : user._id, token : token } } }) );
		});
    }

	function fnRegisterUser( request, res )
	{
		var registerParams = parseRequest( request );
		var isValidLogin = validateUser( registerParams.username, registerParams.password );

		if( isValidLogin !== true )
		{
			handleResponse( { res : res, status : 400, action : 'Register New User', message : isValidLogin, data : {} } );
			return;
		}
		var query = User.findOne({ username : registerParams.username, password : registerParams.password });
		query.exec().then(function(user){
			if( !_.isEmpty( user ) )
			{
				handleResponse( { res : res, status : 400, action : 'Register New User', message : 'A user with these credentials already exists. Please choose a new email address and password combination.', data : { user : user } } );
				return;
			}
			var authToken = generateAuthToken();
			var newUser = new User({ username : registerParams.username, password : registerParams.password, token : authToken });
			newUser.save( sendDatabaseResponse.bind({ res : res, action : 'Register New User', message : 'New user registered', data : { user : { id : 0, token : authToken } } }) );
		});
	}

    function fnLogoutUser( authtoken, res )
    {
        //log the user out
		var query = User.findOne({ token : authtoken });
		query.exec().then( function(user){
			if( _.isEmpty(user) )
			{
				handleResponse( { res : res, status : 404, action : 'Log Out User', message : 'User not found', data : {} });
				return;
			}
			//Set the token to empty for the user
			user.token = '';
			user.save( sendDatabaseResponse.bind({ res : res, action : 'Log Out User', message : 'The user has been successfully logged out', data : { user : [] } }) );
		});
    }

	function isAuthorized( authToken )
    {
        var query = User.findOne({ token : authToken });
        return query.exec();
    }

    function fnGetUser( data, res )
    {
		isAuthorized( data.authToken ).then(function( user ){
            if( _.isEmpty(user) )
            {
				handleResponse( { res : res, status : 403, action : 'Get User', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
			var query = User.findOne({ "_id" : mongoose.Types.ObjectId(data.userId) });
			query.exec( sendDatabaseResponse.bind({ res : res, action : 'Get User', message : 'User retrieved successfully', data : { settings : {} } }) );
        });
    }

    function fnSaveUser( data, res )
    {
        //save the user
		isAuthorized( data.authToken ).then(function( user ){
            if( _.isEmpty(user) )
            {
				handleResponse( { res : res, status : 403, action : 'Save User', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
			var ObjectId = mongoose.Types.ObjectId;
			User.update( { "_id" : mongoose.Types.ObjectId(data.userId) }, data.user,  sendDatabaseResponse.bind({ res : res, action : 'Save User', message : 'User saved successfully', data : { settings : {} } }) );
        });
    }

	function fnDeleteUser( data, res )
    {
        //delete the user
        //return the deletion confirmation
    }

	module.exports = {
        init       		: initialize,
        loginUser  		: fnLoginUser,
		registerUser 	: fnRegisterUser,
        logoutUser 		: fnLogoutUser,
        getUser    		: fnGetUser,
        saveUser   		: fnSaveUser,
		deleteUser		: fnDeleteUser
    };
}());
