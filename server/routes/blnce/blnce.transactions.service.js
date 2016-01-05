(function() {
	"use strict";

    var db;
	var _ = require('lodash');
    var Transactions = require('./blnce.transactions.model');
    var User = require('./blnce.user.model');

    function initialize()
    {
        //db = database.createDatabaseConnection('test');
    }

    //TRANSACTION SERVICES

    function fnIsAuthorized( authToken )
    {
        var query = User.findOne({ token : authToken });
        return query.exec();
    }

	function fnGetAllUserTransactions(data)
    {
        return fnIsAuthorized( data.authToken ).then(function( user ){
            if( !_.isEmpty(user) )
            {
                var query = Transactions.find({ userId : user._id });
        		return query.exec();
            }
            else return { status : 'error', message : 'This user is not authorized to access this content. Please login.' };
        });
    }

    function fnGetMonthTransactions(data)
    {
        return fnIsAuthorized( data.authToken ).then(function( user ){
            if( !_.isEmpty(user) )
            {
                var query = Transactions.find({ month : data.month, userId : user._id });
        		return query.exec();
            }
            else return { status : 'error', message : 'This user is not authorized to access this content. Please login.' };
        });
    }

    function fnGetMonthTransaction(data)
    {
        return fnIsAuthorized( data.authToken ).then(function( user ){
            if( !_.isEmpty(user) )
            {
                var query = Transactions.findOne({ month : data.month, _id : data.id, userId : user._id });
        		return query.exec();
            }
            else return { status : 'error', message : 'This user is not authorized to access this content. Please login.' };
        });
    }

    function fnAddMonthTransaction(data)
    {
        return fnIsAuthorized( data.authToken ).then(function( user ){
            if( !_.isEmpty(user) )
            {
                var query = Transactions.findOne({ month : data.month, userId : user._id });
        		return query.exec().then(function(transactionsMonth){
                    if( _.isEmpty( transactionsMonth ) )
                    {
                        var newMonthTransactions = new Transactions({ month : data.month, monthBalance : data, userId : user._id, transactions : [ data.transaction ] });
                        return newMonthTransactions.save();
                    }
                    else{
                        transactionsMonth.transactions.push( data.transaction );
                        return transactionsMonth.save();
                    }
                });
            }
            else return { status : 'error', message : 'This user is not authorized to access this content. Please login.' };
        });
    }

    function fnSaveMonthTransactions(data)
    {
        return fnIsAuthorized( data.authToken ).then(function( user ){
            if( !_.isEmpty(user) )
            {
                return Transactions.update({ userId : user._id, month : data.monthTransactions.month }, data.monthTransactions, { upsert : true });
            }
            else return { status : 'error', message : 'This user is not authorized to access this content. Please login.' };
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
