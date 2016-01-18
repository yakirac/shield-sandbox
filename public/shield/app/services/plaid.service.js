;(function() {
	"use strict";
	// factory
	angular.module( "app.core" ).factory( "PlaidService", fnService );

	function fnService( $http ) {
        var plaidService = this;

        return {
            getInstitutions	: fnGetInstitutions,
            addAccount      : fnAddAccount,
            verifyAccount   : fnVerifyAccount
		};

        function fnGetInstitutions()
		{
			return $http.get('/blnce/institutions');
		}

        function fnAddAccount( data, authToken )
        {
            return $http.post('/blnce/connect-account', data, { headers : { 'X-Auth-Token' : authToken } } );
        }

        function fnVerifyAccount( data, authToken )
        {
            return $http.post('/blnce/connect-verify-account', data, { headers : { 'X-Auth-Token' : authToken } } );
        }
	}
})();
