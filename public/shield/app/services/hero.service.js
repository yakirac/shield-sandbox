;(function() {
	"use strict";
	// factory
	angular.module( "app.core" ).factory( "heroService", fnService );

	function fnService( $http ) {
		return {
			getHeros : fnGetHeros,
			getHero : fnGetHero
		};
		function fnGetHeros(){
            return $http.get('shield/app/data/heros.json')
                   .success(function( data ){
                        //cl( 'Data baby: ' + data[1].name );
                        return data;
                   }).error(function(){
                        //$log.log('This is cray');
                        return 'This is cray';
                   });
		}
		function fnGetHero(){

		}
	}
})();
