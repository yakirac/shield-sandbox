(function() {
	"use strict";
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

	var UserSchema = new Schema({
		name					: String,
		username 				: String,
        password 				: String,
        token    				: String,
		bankAccounts 			: [{ name : String, accessToken : String }],
		notificationSettings 	: { email : Boolean }
    });

	module.exports = mongoose.model('User', UserSchema);
}());
