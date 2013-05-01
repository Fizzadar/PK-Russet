/*
	file: js/pkrusset.js
	desc: core game loop/etc
*/

var pkrusset = {
	gameLoops: 0,
	//loop id
	intervalId: 0,
	//start functions
	starts: [],
	//loop functions
	loops: [],
	//window size in blocks
	windowWidth: Math.floor( $( window ).width() / 32 ),
	windowHeight: Math.floor( $( window ).height() / 32 ),

	//log msg
	log: function( text ) {
		console.log( '[PK Russet]: ' + text );
	},

	//log error
	logError: function( text ) {
		console.log( '[PK Russet] Error: ' + text );
		return false;
	},

	//add start function
	addStart: function( func ) {
		this.starts[this.starts.length] = func;
	},

	//add loop function
	addLoop: function( func ) {
		this.loops[this.loops.length] = func;
	},

	//start loop
	start: function() {
		this.log( 'Starting up...' );

		//each start function
		for( var i = 0; i < this.starts.length; i++ )
			if( !this.starts[i]() )
				return this.logError( 'Start failed on: ' + this.starts[i] );


		//setTimeout( 'loader.hide();', 2000 );

		//start loop
		//this.intervalId = setInterval( this.loop, 40 );
		this.loop();
		this.log( 'Started' );
	},

	//end loop
	stop: function() {
		clearInterval( this.intervalId );
		this.intervalId = 0;
	},

	//game loop
	loop: function() {
		//loop bits
		for( var i = 0; i < pkrusset.loops.length; i++ )
			if( pkrusset.loops[i]() == false )
				return pkrusset.log( 'Loop bug/fail on: ' + pkrusset.loops[i] );

		//count ticks of game
		pkrusset.gameLoops++;

		setTimeout( 'pkrusset.loop()', 17 );
	}
};