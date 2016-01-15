(function() {
	"use strict";

    var db;
	var _ = require('lodash');
	var mongoose = require('mongoose');
    var Transactions = require('./blnce.transactions.model');
    var User = require('./blnce.user.model');

    function initialize()
    {
        //db = database.createDatabaseConnection('test');
    }

    //TRANSACTION SERVICES

	function sendDatabaseResponse( err, responseData )
	{
		if( !err ) this.data.transactions = responseData;
		handleResponse({ res : this.res, status : err ? 400 : 200, action : this.action, message : err ? err.message : this.message, data : this.data });
	}

	function handleResponse( responseData )
	{
		//res.status(200).json({ "result" : "Save Month Transactions", "response" : resp });
		var response = _.extend({}, { status : responseData.status, message : responseData.message }, responseData.data );
		responseData.res.status( responseData.status ).json({ "action" : responseData.action, "response" : response });
	}

    function isAuthorized( authToken )
    {
        var query = User.findOne({ token : authToken });
        return query.exec();
    }

	function fnGetAllUserTransactions( data, res )
    {
        isAuthorized( data.authToken ).then(function( user ){
            if( _.isEmpty(user) )
            {
				handleResponse( { res : res, status : 403, action : 'Get All Transactions', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
			var query = Transactions.find({ userId : user._id });
			query.exec( sendDatabaseResponse.bind( { res : res, action : 'Get All Transactions', message : 'Transactions retrieved successfully', data : { transactions : {} } } ) );
        });
    }

    function fnGetMonthTransactions( data, res )
    {
        isAuthorized( data.authToken ).then(function( user ){
			if( _.isEmpty(user) )
            {
				handleResponse( { res : res, status : 403, action : 'Get Month Transactions', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
			var query = Transactions.find({ month : data.month, userId : user._id });
			query.exec( sendDatabaseResponse.bind( { res : res, action : 'Get Month Transactions', message : 'Transactions retrieved successfully', data : { transactions : {} } } ) );
        });
    }

    function fnGetMonthTransaction( data, res )
    {
        isAuthorized( data.authToken ).then(function( user ){
			if( _.isEmpty(user) )
            {
				handleResponse( { res : res, status : 403, action : 'Get Month Transaction', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
			var query = Transactions.findOne({ month : data.month, userId : user._id, transactions : { $elemMatch : { "_id" : mongoose.Types.ObjectId(data.id) } } });
			query.exec( sendDatabaseResponse.bind( { res : res, action : 'Get Month Transaction', message : 'Transaction retrieved successfully', data : { transactions : {} } } ) );
		});
    }

    function fnAddMonthTransaction( data, res )
    {
        isAuthorized( data.authToken ).then(function( user ){
			if( _.isEmpty(user) )
            {
				handleResponse( { res : res, status : 403, action : 'Add New Month Transaction', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
			var query = Transactions.findOne({ month : data.month, userId : user._id });
			query.exec().then(function(transactionsMonth){
				if( _.isEmpty( transactionsMonth ) )
				{
					var newMonthTransactions = new Transactions({ month : data.month, monthBalance : data, userId : user._id, transactions : [ data.transaction ] });
					newMonthTransactions.save( sendDatabaseResponse.bind( { res : res, action : 'Add New Month Transaction', message : 'Transaction added successfully', data : { transactions : {} } } ) );
				}
				else{
					transactionsMonth.transactions.push( data.transaction );
					transactionsMonth.save( sendDatabaseResponse.bind( { res : res, action : 'Add New Month Transaction', message : 'Transaction added successfully', data : { transactions : {} } } ) );
				}
			});
        });
    }

    function fnSaveMonthTransactions( data, res )
    {
        isAuthorized( data.authToken ).then(function( user ){
			if( _.isEmpty(user) )
            {
				handleResponse( { res : res, status : 403, action : 'Save Month Transactions', message : 'This user is not authorized to access this content. Please login.', data : {} });
				return;
            }
			Transactions.update({ userId : user._id, month : data.monthTransactions.month }, data.monthTransactions, { upsert : true }, sendDatabaseResponse.bind( { res : res, action : 'Save Month Transaction', message : 'Transactions saved successfully', data : { transactions : {} } } ));
        });
    }

    //IMPLEMENT LATER. Right now the saving scheme does not call for this.
    /*function fnDeleteMonthTransactions(data) {
        var monthTransactions = new Transactions(data.monthTransactions);
        return monthTransactions.save();
    }*/

	module.exports = {
        init       		        : initialize,
        getAllUserTransactions  : fnGetAllUserTransactions,
		getMonthTransactions    : fnGetMonthTransactions,
        getMonthTransaction     : fnGetMonthTransaction,
        addMonthTransaction     : fnAddMonthTransaction,
        saveMonthTransactions   : fnSaveMonthTransactions
    };
}());
