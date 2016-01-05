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

	function fnValidateUser( username, password )
	{
		if( _.isEmpty( username ) && _.isEmpty( password ) ) return 'The credentials entered were invalid';
		if( _.isEmpty( username ) ) return 'Please provide a valid email address';
		if( _.isEmpty( password ) ) return 'Please provide a valid password';

		return true;
	}

	function fnGenerateAuthToken()
	{
		var authToken = '';
		var charString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		do {
			var c = charString[Math.floor(Math.random()*charString.length)];
			authToken += c;
		} while( authToken.length < 16 );

		return authToken;
	}

    function fnLoginUser(request)
    {
		var isValidLogin = fnValidateUser( request.username, request.password );

		if( isValidLogin === true )
		{
			var query = User.findOne({ username : request.username, password : request.password });
			return query.exec().then(function(user){
				if( !_.isEmpty(user) )
				{
					user.token =  fnGenerateAuthToken();
					if( _.isUndefined(user.notificationSettings.email) ) user.notificationSettings = { email : false };
					return user.save();
				}else {
					return { status : 'error', message : 'The user you are trying to login as could not be found. Please check your credentials.', user : user };
				}
			});
		}
		else return { status : 'error', message : isValidLogin };

		//return the user auth token
    }

	function fnRegisterUser(request)
	{
		var createdUser;
		var isValidLogin = fnValidateUser( request.username, request.password );

		//Create a new user and add them to the db
		if( isValidLogin === true )
		{
			var query = User.findOne({ username : request.username, password : request.password });
			return query.exec().then(function(user){
				if( _.isEmpty(user) )
				{
					var authToken = fnGenerateAuthToken();
					var newUser = new User({ username : request.username, password : request.password, token : authToken });
					return newUser.save();
				}else {
					return { status : 'error', message : 'A user with these credentials already exists. Please choose a new email address and password combination.', user : user };
				}
			});
		}
		else return { status : 'error', message : isValidLogin };
		//return the new user and a new authtoken
	}

    function fnLogoutUser(authtoken)
    {
        //log the user out
		var query = User.findOne({ token : authtoken });
		return query.exec().then( function(user){
			if( !_.isEmpty(user) )
			{
				//Set the token to empty for the user
				user.token = '';
				return user.save();
			}
			else {
				return { status : 'error', message : 'User not found' };
			}
		});
    }

	function fnIsAuthorized( authToken )
    {
        var query = User.findOne({ token : authToken });
        return query.exec();
    }

    function fnGetUser(data)
    {
		return fnIsAuthorized( data.authToken ).then(function( user ){
            if( !_.isEmpty(user) )
            {
				var query = User.findOne({ "_id" : mongoose.Types.ObjectId(data.userId) });
        		return query.exec();
            }
            else return { status : 'error', message : 'This user is not authorized to access this content. Please login.' };
        });
    }

    function fnSaveUser(data)
    {
        //save the user
		return fnIsAuthorized( data.authToken ).then(function( user ){
            if( !_.isEmpty(user) )
            {
				var ObjectId = mongoose.Types.ObjectId;
				return User.update({ "_id" : mongoose.Types.ObjectId(data.userId) }, data.user );
            }
            else return { status : 'error', message : 'This user is not authorized to access this content. Please login.' };
        });
        //return the save confirmation
    }

	function fnDeleteUser(data)
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
