;(function() {
	"use strict";
	// factory
	angular.module( "app.core" ).factory( "ParseService", fnService );

	function fnService() {
		Parse.initialize("FxbOE0AL203nVhZ6sZU87ozvcqm0MtBtS2IILksx", "MV5LGnweiopFUxCpxeq1VE1VM5EvaojIJZvGVlV0");
        function fnCreateUser( email, password ) {
            var newUser = new Parse.User();
            newUser.set( 'username', email );
            newUser.set( 'password', password );
            
            return newUser.signUp();
        }

        function fnLoginUser( email, password ) {
            return Parse.User.logIn( email, password );
        }

        function fnLogoutUser() {
            return Parse.User.logOut();
        }

        function fnGetCurrentUser()
        {
            return Parse.User.current();
        }

        function fnResetPassword( email ) {
            Parse.User.requestPasswordReset( email, {
                success : function( user ) {

                },
                error : function( error, user ) {
                    alert( 'We were unable to submit your reset request : ' + error.message );
                }
            });
        }

        return {
            createUser : fnCreateUser,
            loginUser : fnLoginUser,
            logoutUser : fnLogoutUser,
            currentUser : fnGetCurrentUser
        };
	}
})();
