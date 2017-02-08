;(function() {
	"use strict";
	// factory
	angular.module( "app.core" ).factory( "PlaidService", fnService );

	function fnService( $http, SERVER_API_URL ) {
        var plaidService = this;

        return {
            getInstitutions	: fnGetInstitutions,
            addAccount      : fnAddAccount,
            verifyAccount   : fnVerifyAccount
		};

        function fnGetInstitutions()
		{
			return $http.get(SERVER_API_URL + '/blnce/institutions');
		}

        function fnAddAccount( data, authToken )
        {
            var config = { headers : { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Auth-Token' : authToken } };
            return $http.post(SERVER_API_URL + '/blnce/connect-account', data, config);
        }

        function fnVerifyAccount( data, authToken )
        {
            var config = { headers : { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Auth-Token' : authToken } };
            return $http.post(SERVER_API_URL + '/blnce/connect-verify-account', data, config);
        }
	}
})();
