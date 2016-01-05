;(function() {
	"use strict";
	// factory
	angular.module( "app.core" ).factory( "userService", fnService);
	
	function fnService() {
		return {
			getCurrentUser : fnGetCurrentUser,
			getUserFoodOpts: fnGetFoodsOpts,
			saveUser : fnSaveUser
		};
		function fnSaveUser( user ){
			if( _.isEmpty( user ) ){
				return {
					success:false
				};
			}	
			if( ! _.has( user, "first_name" ) && ! _.has( user, "last_name" ) ){
				return {
					success:false
				};
			}
			if( user.first_name.length === 0 && user.last_name.length === 0 ){
				return {
					success:false
				};
			}
			return { success:true};
		}
		function fnGetCurrentUser(){
			return {
				first_name: "Josh",
				last_name: "Gonzalez",
				email: "josh@memberclicks.com",
				fav_food: "BBQ"
			};
		}
		function fnGetFoodsOpts(){
			return [
				{ "text" : "BBQ" }, { "text" : "Chicken" }, {"text":"Hamburgers"}
			];
		}
	}
})();
