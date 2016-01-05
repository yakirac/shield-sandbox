(function() {
	"use strict";
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    //recurringTypes : [{ "id" : 1, "selected" : false, "symbol" : "D", "value" : "Daily" }, { "id" : 2, "selected" : false, "symbol" : "W", "value" : "Weekly" }, { "id" : 3, "selected" : false, "symbol" : "BW", "value" : "Bi-weekly" }, { "id" : 4, "selected" : true, "symbol" : "M", "value" : "Monthly" }]
    var TransactionDetailsSchema = new Schema({
        company 		: String,
        description 	: String,
        recurringTypes 	: [{ id : Number, selected : Boolean, symbol : String, value : String }],
        recurringDay 	: { month : Number, dayOfMonth : Number, dayOfWeek : String },
        amount 			: Number
    });

    var TransactionSchema = new Schema({
		id 				: Number,
		recurring 		: Boolean,
        recurringYear 	: Number,
        transactionType : Number,
        details 		: TransactionDetailsSchema
    });

    var TransactionsSchema = new Schema({
        userId          : Schema.Types.ObjectId,
        month           : String,
        monthBalance    : Number,
        transactions    : [TransactionSchema]
    });

	module.exports = mongoose.model('Transactions', TransactionsSchema);
}());
