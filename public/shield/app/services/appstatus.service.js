;(function() {
	"use strict";
	// factory
	angular.module( "app.core" ).factory( "appStatusService", [ "$window", "$rootScope", fnService ] );

	function fnService( $window, $rootScope ) {
        var asService = this;
        asService.online = $window.navigator.onLine;

        function setAppStatus( status )
        {
            asService.online = status;
        }

		function fnIsOnline(){
            return asService.online;
		}

        $window.addEventListener('online', function(){
            setAppStatus( true );
            //$rootScope.digest();
        });

        $window.addEventListener('offLine', function(){
            setAppStatus( false );
            //$rootScope.digest();
        });

        return {
            isOnline : fnIsOnline
		};
	}
})();
