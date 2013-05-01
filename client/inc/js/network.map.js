network.map = {
	characters: {},

	//start
	start: function( server ) {
		//get server, send our map
		this.server = server;
		this.server.emit( 'set_map', { map: data.player.map, image: data.player.image } );

		//once confirmed, add other functions
		this.server.on( 'set_map_confirm', function( data ) {
			pkrusset.log( 'Map confirmed, sending/receiving data...' );

			this.on( 'position_data', function( data ) {
				network.map.positionData( data );
			});

			this.on( 'client_exit', function( data ) {
				network.map.clientExit( data );
			});

			this.on( 'client_join', function( data ) {
				network.map.clientJoin( data );
			});
		});

		//get players
		this.players = $( '#players' );



		//setup
		this.animInterval = 140;
		this.animTimer = 0;
		this.curDirection = 'down';
		this.character = new character( this, 'network.map.element' );
	},

	//send position
	sendPosition: function() {
		if( this.server )
			this.server.emit( 'set_position', { x: data.player.xpos, y: data.player.ypos } );
	},
	//change map
	changeMap: function() {
		if( this.server )
			this.server.emit( 'change_map', { map: data.player.map } );
	},



	//client exit
	clientExit: function( data ) {
		if( !data.key ) return;
		console.log( $( 'img#' + data.key, this.players ) );
		$( 'img#' + data.key, this.players ).remove();
		pkrusset.log( 'Client exit: ' + data.key );
	},

	//client join
	clientJoin: function( data ) {
		if( !data.key || isNaN( data.image )  ) return;

		//build our player
		this.players.append( '<img src="inc/img/players/' + data.image + '/10.png" id="' + data.key + '" style="display:none;" />' );
		this.characters[data.key] = $( 'img#' + data.key, this.players );
		this.characters[data.key].animInterval = 240;
		this.characters[data.key].animTimer = 0;
		this.characters[data.key].curDirection = 'down';
		this.characters[data.key].character = new character( this.characters[data.key], 'network.map.characters["' + data.key + '"]' );
		this.characters[data.key].hidden = true;

		pkrusset.log( 'Client join: ' + data.key );
	},

	//position data
	positionData: function( data ) {
		if( !data.key || !data.xpos || !data.ypos ) return;
		var character = this.characters[data.key];
		if( !character ) return;

		//hidden?
		if( character.hidden ) {
			character.css( 'display', 'block' );
			character.hidden = false;
		}

		//set position
		character.css( { marginLeft: ( data.xpos - 1 ) * 32, marginTop: ( data.ypos - 1 ) * 32 } );
		//work out direction + animate
		var direction = false;
		if( data.xpos > character.xpos )
			direction = 'right';
		else if( data.xpos < character.xpos )
			direction = 'left';
		else if( data.ypos < character.ypos )
			direction = 'up';
		else if( data.ypos > character.ypos )
			direction = 'down';

		if( direction ) {
			character.character.animate( direction );
			character.curDirection = direction;
		}



		//set new positions
		character.xpos = data.xpos;
		character.ypos = data.ypos;
	},


	test: function( direction ) {
		this.character.animate( direction );
		this.curDirection = direction;
	}
};