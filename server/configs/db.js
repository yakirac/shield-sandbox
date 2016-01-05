(function(){
    "use strict";

    var mongoose = require('mongoose');
    var config = require('./config');

    function createDBConnection( database )
    {
        newMongooseConnection( database );
    }

    function newMongooseConnection( database )
	{
		mongoose.connect( config.mongodb.dbURI + '/' + database, config.mongodb.dbOptions );
		var db = mongoose.connection;
        db.on( 'connected', function(){ console.log( 'Mongoose connected successfully to: ' + config.mongodb.dbURI ); } );
        db.on( 'disconnected', function(){ console.log( 'Mongoose disconnected from: ' + config.mongodb.dbURI ); } );
		db.on( 'error', console.error.bind( console, 'Mongoose connection error:' ) );

        // if the Node process ends, close the Mongoose connection
	    process.on('SIGINT', function() {
	        db.close(function () {
	            console.log('Mongoose disconnected through app termination');
	            process.exit(0);
	        });
	    });

		return db;
	}

	function closeDBConnection()
	{
		mongoose.disconnect();
	}

    module.exports = {
        createDatabaseConnection : createDBConnection,
        closeDatabaseConnection  : closeDBConnection
    };

}());
