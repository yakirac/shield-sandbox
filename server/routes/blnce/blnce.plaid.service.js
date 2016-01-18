(function() {
    'use strict';

    var plaid = require('plaid');
    var _ = require('lodash');
    var config = require('../../configs/config');
    var User = require('./blnce.user.model');

    var plaid_env = plaid.environments[config.plaid_env];

    var plaidClient = new plaid.Client('567838ca795b36cc730ba6c5', 'ad3c72901899dffe75894eb9416c83', plaid_env);

    module.exports = {
        getPlaidCategories   : fnGetPlaidCategories,
        getPlaidInstitutions : fnGetPlaidInstitutions,
        getPlaidInstitutionsLongtail : fnGetPlaidInstitutionsLongtail,
        addPlaidConnectUser  : fnAddPlaidConnectUser,
        resolveMFA           : fnResolveMFA,
        getPlaidConnectUser  : fnGetPlaidConnectUser,
        getAccountBalance    : fnGetAccountBalance
    };

    function handlePlaidResponse( error, mfaResponse, response )
    {
        if( error )
        {
            handleResponse( { res : this.res, status : error.code, action : this.action, message : error.resolve, data : {} } );
            return;
        }
        if( mfaResponse )
        {
            handleResponse( { res : this.res, status : 200, action : this.action, message : 'Please verify account', data : mfaResponse } );
            return;
        }
        handleResponse( { res : this.res, status : 200, action : this.action, message : this.message, data : response } );
        addUserBankAccount( this.user, this.bankAccountData.authDetails.accountName, response );
    }

    function handleResponse( responseData )
	{
        var response = _.extend({}, { status : responseData.status, message : responseData.message }, responseData.data );
		responseData.res.status( responseData.status ).json({ "action" : responseData.action, "response" : response });
	}

    function addUserBankAccount( user, accountName, response )
    {
        var newBankAccount = { name : accountName, details : { accounts : response.accounts, transactions : [], access_token : response.access_token } };

        user.bankAccounts.push( newBankAccount );

        user.save();
    }

    function isAuthorized( authToken )
    {
        var query = User.findOne({ token : authToken });
        return query.exec();
    }

    function fnGetPlaidCategories( res )
    {
        plaid.getCategories( plaid_env, function( error, result ){
            if( error )
            {
                handleResponse( { res : res, status : error.code, action : 'Get Plaid Categories', message : error.resolve, data : {} } );
            }

            handleResponse( { res : res, status : 200, action : 'Get Plaid Categories', message : '', data : { categories : result } } );
		});
    }

    function fnGetPlaidInstitutions( res )
    {
        plaid.getInstitutions( plaid_env, function( error, result ){
            if( error )
            {
                handleResponse( { res : res, status : error.code, action : 'Get Plaid Institutions', message : error.resolve, data : {} } );
            }

            handleResponse( { res : res, status : 200, action : 'Get Plaid Institutions', message : '', data : { institutions : result } } );
		});
    }

    function fnGetPlaidInstitutionsLongtail( res )
    {
        plaid.getInstitutions( plaid_env, function( error, result ){
            if( error )
            {
                handleResponse( { res : res, status : error.code, action : 'Get Plaid Institutions', message : error.resolve, data : {} } );
            }

            handleResponse( { res : res, status : 200, action : 'Get Plaid Institutions', message : '', data : { institutions : result } } );
		});
    }

    function fnAddPlaidConnectUser( data, res )
    {
        isAuthorized( data.authToken ).then(function( user ){
            if( _.isEmpty( user ) )
            {
                handleResponse( { res : res, status : 403, action : 'Add Plaid User', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
            //console.log( data );
            //Make plaid call to add user
            plaidClient.addConnectUser( data.authDetails.type, data.authDetails.credentials, { login_only : true }, handlePlaidResponse.bind({ res : res, action: 'Add New Account', message : 'Account successfully added', user : user, bankAccountData : data }) );
        });
    }

    function fnResolveMFA( data, res )
    {
        isAuthorized( data.authToken ).then(function( user ){
            if( _.isEmpty( user ) )
            {
                handleResponse( { res : res, status : 403, action : 'Add Plaid User', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
            //Make plaid call to add user
            //plaidClient.stepConnectUser( data.access_token, data.mfaResponse, {}, handlePlaidResponse.bind({ res : res, action: 'Verify New Account', message : 'Account successfully verified', user : user }));
        });
    }

    function fnGetPlaidConnectUser( data, res )
    {
        isAuthorized( data.authToken ).then(function( user ){
            if( _.isEmpty( user ) )
            {
                handleResponse( { res : res, status : 403, action : 'Get Plaid User', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
            //Make plaid call to get the plaid user
            //plaidClient.getConnectUser( data.access_token, {}, handlePlaidResponse);
        });
    }

    function fnGetAccountBalance( data, res )
    {
        isAuthorized( data.authToken ).then(function( user ){
            if( _.isEmpty( user ) )
            {
                handleResponse( { res : res, status : 403, action : 'Get Account Balance', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
            //Make plaid call to get the account balance
            //plaidClient.getBalance( access_token, {}, handlePlaidResponse);
        });
    }

}());
