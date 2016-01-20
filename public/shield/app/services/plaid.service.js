;(function() {
	"use strict";
	// factory
	angular.module( "app.core" ).factory( "PlaidService", fnService );

	function fnService( $http ) {
        var plaidService = this;

        return {
            getInstitutions	: fnGetInstitutions,
            addAccount      : fnAddAccount,
            verifyAccount   : fnVerifyAccount,
			applyToPlaid	: fnApplyToPlaid
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

		function fnApplyToPlaid( data, authToken )
		{
			var applicationData = {
				"name": "Yakira C. Bristol",
				"email": "hello@yakirac.me",
				"resume": "www.linkedin.com/in/yakiracbristol",
				"github": "github.com/yakirac",
				"twitter": "@yakiracb",
				"website": "www.yakirac.me/work"
			};

			return $http.post('https://plaid.com/careers/submit/', applicationData );
		}
	}
})();
