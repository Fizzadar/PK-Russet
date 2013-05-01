network.map = {
	characters: {},
	spaceTime: 0,

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
			this.on( 'receive_chat', function( data ) {
				network.map.receiveChat( data );
			});
		});

		//get players
		this.players = $( '#players' );
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
	//send chat
	sendChat: function( text ) {
		if( this.server ) {
			this.server.emit( 'send_chat', { text: text } );
			var chat = $( '#player div.chat' );
			clearTimeout( chat.timeout );
			chat.show();
			chat.html( text );
			chat.timeout = setTimeout( "$( '#player div.chat' ).hide();", 2000 );
		}
	},



	//client exit
	clientExit: function( data ) {
		if( !data.key || !this.characters[data.key] ) return;
		this.characters[data.key].remove();
		pkrusset.log( 'Client exit: ' + data.key );
	},

	//client join
	clientJoin: function( data ) {
		if( !data.key || isNaN( data.image )  ) return;

		//build our player
		this.players.append( '<div id="' + data.key + '" style="display:none;" class="player"><div class="chat"></div><img src="inc/img/players/' + data.image + '/10.png" /></div>' );
		this.characters[data.key] = $( '#' + data.key, this.players );
		this.characters[data.key].img = $( 'img', this.characters[data.key] );
		this.characters[data.key].chat = $( 'div.chat', this.characters[data.key] );
		this.characters[data.key].animInterval = 240;
		this.characters[data.key].animTimer = 0;
		this.characters[data.key].curDirection = 'down';
		this.characters[data.key].character = new character( this.characters[data.key], 'network.map.characters["' + data.key + '"].img' );
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
		character.animate( { marginLeft: ( data.xpos - 1 ) * 32, marginTop: ( data.ypos - 1 ) * 32 }, 140 );
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

	//chat
	receiveChat: function( data ) {
		if( !data.key || !data.text ) return;
		//clear timeout
		clearTimeout( this.characters[data.key].chatTimeout );
		//add chat
		$( '.chat', this.characters[data.key] ).show();
		$( '.chat', this.characters[data.key] ).html( data.text );
		//add timeout
		this.characters[data.key].chatTimeout = setTimeout( 'network.map.characters["' + data.key + '"].chat.hide();', 2000 );
	}
};