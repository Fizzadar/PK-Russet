//node files
var config = require( './config.js' ),
    data = require( './data.js' ),
    randomstring = require( 'randomstring' );

//shared files
var calculation = require( '../client/inc/js/shared/calculation.js' ),
    battle = require( '../client/inc/js/shared/battle.js' );

//share things w/ servers
module.exports.calculation = calculation;
module.exports.data = data;
module.exports.randomstring = randomstring;

//get socket, bind to port
var socket = require( 'socket.io' ).listen( config.port, { 'log level': 3 } );

//map server
var map = require( './map.js' ).start( socket );




var play = socket.of( '/play' );
play.on( 'connection', function( client ) {
});