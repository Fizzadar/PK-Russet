/*
	file: js/pkrusset.js
	desc: core game loop/etc
*/

//bits / http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
//http://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

Object.identical = function( obj ) {
	for( var key in obj )
		if( !this[key] || obj[key] != this[key] )
			return false

	return true;
}

//lets go
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

	//message (displayed)
	message: function( text ) {
		messages.addMessage( '', text );
		this.log( text );
	},

	//log success (displayed)
	success: function( text ) {
		messages.addMessage( 'success', text );
		this.log( text );
	},

	//log warning (displayed)
	warning: function( text ) {
		messages.addMessage( 'warning', text );
		this.log( text );
	},

	//log error (displayed)
	error: function( text, server ) {
		messages.addMessage( 'error', text );
		console.error( '[PK Russet] Error: ' + text );

		if( server ) network.receive( network.command, {} );

		return false;
	},

	//log msg (console/debug only)
	log: function( text ) {
		console.log( '[PK Russet]: ' + text );
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
				return this.error( 'Start failed on: ' + this.starts[i] );


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