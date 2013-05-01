/*
	file: js/data.js
	desc: generic data structure for common bits
*/

var network = {
	busy: false,
	command: '',
	server: 'self',
	playServer: false,
	mapServer: false,

	//start
	start: function() {
		//bind connect button
		$( '.pkrusset_connect' ).bind( 'click', function( ev ) {
			ev.preventDefault();
			//save local stuff
			player.save();
			//connect
			var host = prompt( 'Enter hostname' );
			var port = prompt( 'Enter port' );
			network.connect( host, port );
		});
		return true;
	},

	//send a network function (to /play on node server)
	send: function( command, data, callback ) {
		if( this.busy ) return;

		//set to busy & command
		this.busy = true;
		this.command = command;
		this.callback = callback;

		//make our request
		if( !this.playServer ) {
			server.command( command, data )
		} else {
			//SEND OVER SOCKET
			//send w/ user identifier
		}
	},

	//complete request
	receive: function( command, data ) {
		if( this.command != command ) return pkrusset.error( 'Server sync error (got command ' + command + ', wanting ' + this.command + ')' );

		//call our callback
		this.callback( data );

		//close everything
		this.busy = false;
		this.command = '';
		this.callback = null;
	},

	//connect to a (node) server
	connect: function( host, port ) {
		pkrusset.log( 'Attemting to connect to ' + host + ':' + port );

		//do servers
		var playServer = io.connect( 'http://' + host + ':' + port + '/play' ),
			mapServer = io.connect( 'http://' + host + ':' + port + '/map' );

		//bind connections
		playServer.on( 'connect', function() {
			network.playServer = playServer;
			pkrusset.success( 'Connected to play server' );
		});
		mapServer.on( 'connect', function() {
			network.map.start( mapServer );
			pkrusset.success( 'Connected to map server' );
		});
	}
};

pkrusset.addStart( network.start );