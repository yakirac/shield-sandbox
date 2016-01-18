(function() {
	"use strict";
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

	var BankAccountSchema = new Schema({
		name 	: String,
		details : {
			accounts 		: [],
			transactions 	: [],
			access_token 	: String
		}
	});

	var UserSchema = new Schema({
		name					: String,
		username 				: String,
        password 				: String,
        token    				: String,
		bankAccounts 			: [BankAccountSchema],
		notificationSettings 	: { email : Boolean }
    });

	module.exports = mongoose.model('User', UserSchema);
}());
