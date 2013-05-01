/*
	file: js/move.js
	desc: move player around the map, deals with blocks/levels, css and animation
*/

var move = {
	//timers (coded)
	animTimer: 0,
	animInterval: 140,
	moveTimer: 0,
	moveInterval: 140,
	//divs
	player: null,
	image: null,
	map: null,
	//timers (setTimeout)
	animStep1: 0,
	animStep2: 0,
	animStep3: 0,
	//current direction
	curDirection: 'down',
	//map element offsets
	mapOffsetX: 0,
	mapOffsetY: 0,

	//start
	start: function() {
		move.player = $( 'div#player' );
		move.image = $( 'div#player img' );
		move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/10.png' );
		move.map = $( '#map,#overmap' );

		return true;
	},

	//loop function
	loop: function() {
		if( move.disabled ) return;

		//get time
		var curTime = new Date().getTime() + 1;

		//too early?
		if( curTime < move.moveTimer )
			return;

		//is the shift key down (walking)
		if( keyboard.down( 'shift' ) ) {
			move.moveInterval = 280;
			move.animInterval = 560;
		} else {
			move.moveInterval = 120;
			move.animInterval = 240;
		}

		//up
		if( keyboard.down( 'w' ) || keyboard.down( 'up' ) )
			move.up( curTime );

		//down
		else if( keyboard.down( 's' ) || keyboard.down( 'down' ) )
			move.down( curTime );

		//left
		else if( keyboard.down( 'a' ) || keyboard.down( 'left' ) )
			move.left( curTime );

		//right
		else if( keyboard.down( 'd' ) || keyboard.down( 'right' ) )
			move.right( curTime );
	},

	//animate
	animate: function( direction, curTime ) {
		//anim time?
		if( curTime < this.animTime && this.curDirection == direction )
			return;

		//clear timeout
		clearTimeout( this.animStep1 );
		clearTimeout( this.animStep2 );
		clearTimeout( this.animStep3 );

		//animate!
		switch( direction ) {
			case 'up':
				this.animStep1 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/8.png' );", move.animInterval / 3 );
				this.animStep2 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/9.png' );", move.animInterval / 3 * 2 );
				this.animStep1 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/1.png' );", move.animInterval );
				break;

			case 'down':
				this.animStep1 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/11.png' );", move.animInterval / 3 );
				this.animStep2 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/12.png' );", move.animInterval / 3 * 2 );
				this.animStep1 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/10.png' );", move.animInterval );
				break;

			case 'left':
				this.animStep1 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/2.png' );", move.animInterval / 3 );
				this.animStep2 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/4.png' );", move.animInterval / 3 * 2 );
				this.animStep1 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/3.png' );", move.animInterval );
				break;

			case 'right':
				this.animStep1 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/6.png' );", move.animInterval / 3 );
				this.animStep2 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/7.png' );", move.animInterval / 3 * 2 );
				this.animStep1 = setTimeout( "move.image.attr( 'src', '_inc/img/players/' + data.player.image + '/5.png' );", move.animInterval );
				break;
		}

		//up anim time
		move.animTime = curTime + move.animInterval;
	},

	//check a block
	checkBlock: function( x, y ) {
		//also check for edges of map!
		if( x < 0 || y < 0 || ( x + 1 ) > data.map.width || ( y + 1 ) > data.map.height ) {
			return false;
		}

		//check the actual block
		var block = data.map.blocks[x + '_' + y];
		if( block ) {
			console.log( block ); //debug
			switch( block.block ) {
				case 'nomove':
					return false;

				case 'door':
					move.disabled = true;
					loader.show();
					map.loadFile( block.data.map, function() {
						data.player.xpos = Number( block.data.x );
						data.player.ypos = Number( block.data.y );
						setTimeout( 'move.moveTo( data.player.xpos, data.player.ypos );loader.hide();move.disabled = false;', 500 );
					});
					return false;
			}
		}

		return true;
	},

	//move up
	up: function( curTime ) {
		//animate
		this.animate( 'up', curTime );
		//update move loop
		move.moveTimer = curTime + move.moveInterval;
		this.curDirection = 'up';

		if( !this.checkBlock( data.player.xpos, data.player.ypos - 1 ) )
			return;

		//move player: if we're under 1/3 way, scroll away!
		if( data.player.ypos < ( pkrusset.windowHeight / 2.25 + this.mapOffsetY ) && this.mapOffsetY > 0 ) {
			this.map.animate( { marginTop: '+=32' }, this.moveInterval );
			this.mapOffsetY -= 1;
		} else {
			this.player.animate( { marginTop: '-=32' }, this.moveInterval );
		}

		//set stuff
		data.player.ypos -= 1;
	},

	//move down
	down: function( curTime ) {
		//animate
		this.animate( 'down', curTime );
		//update move loop
		move.moveTimer = curTime + move.moveInterval;
		this.curDirection = 'down';

		if( !this.checkBlock( data.player.xpos, data.player.ypos + 1 ) )
			return;

		//move player: if we're over 1/3 way, scroll away!
		if( data.player.ypos > ( pkrusset.windowHeight / 1.75 ) && ( this.mapOffsetY + pkrusset.windowHeight ) < data.map.height ) {
			this.map.animate( { marginTop: '-=32' }, this.moveInterval );
			this.mapOffsetY += 1;
		} else {
			this.player.animate( { marginTop: '+=32' }, this.moveInterval );
		}

		//set stuff
		data.player.ypos += 1;
	},

	//move left
	left: function( curTime ) {
		//animate
		this.animate( 'left', curTime );
		//update move loop
		move.moveTimer = curTime + move.moveInterval;
		this.curDirection = 'left';

		if( !this.checkBlock( data.player.xpos - 1, data.player.ypos ) )
			return;

		//set stuff
		data.player.xpos -= 1;

		//move player: if we're over 1/3 way, scroll away!
		if( data.player.xpos < ( pkrusset.windowWidth / 2.25 + this.mapOffsetX ) && this.mapOffsetX > 0 ) {
			$( '#map,#overmap' ).animate( { marginLeft: '+=32' }, this.moveInterval );
			this.mapOffsetX -= 1;
		} else {
			this.player.animate( { marginLeft: '-=32' }, this.moveInterval );
		}
	},

	//move right
	right: function( curTime ) {
		//animate
		this.animate( 'right', curTime );
		//update move loop
		move.moveTimer = curTime + move.moveInterval;
		this.curDirection = 'right';

		if( !this.checkBlock( data.player.xpos + 1, data.player.ypos ) )
			return;

		//set stuff
		data.player.xpos += 1;

		//move player: if we're over 1/3 way, scroll away!
		if( data.player.xpos > ( pkrusset.windowWidth / 1.75 ) && ( this.mapOffsetX + pkrusset.windowWidth ) < data.map.width ) {
			this.map.animate( { marginLeft: '-=32' }, this.moveInterval );
			this.mapOffsetX += 1;
		} else {
			this.player.animate( { marginLeft: '+=32' }, this.moveInterval );
		}
	},

	//set position
	moveTo: function( x, y ) {
		//reset map first
		this.map.css( { marginLeft: 0, marginTop: 0 } );

		//set data
		data.player.xpos = x;
		data.player.ypos = y;

		//do x
		if( x > ( pkrusset.windowWidth / 1.75 ) ) {
			var map_move = x - Math.round( pkrusset.windowWidth / 1.75 );
			var player_move = x - map_move - 1;
			//move player
			this.player.css( { marginLeft: 32 * player_move } );
			//move map
			this.map.css( { marginLeft: -1 * 32 * map_move } );
			this.mapOffsetX = map_move;
		} else {
			this.player.css( { marginLeft: 32 * ( x - 1 ) } );
		}

		//do y
		if( y > ( pkrusset.windowHeight / 1.75 ) ) {
			var map_move = y - Math.round( pkrusset.windowHeight / 1.75 );
			var player_move = y - map_move - 1;
			//move player
			this.player.css( { marginTop: 32 * player_move } );
			//move map
			this.map.css( { marginTop: -1 * 32 * map_move } );
			this.mapOffsetY = map_move;
		} else {
			this.player.css( { marginTop: 32 * ( y - 1 ) } );
		}
	}
}

//add loop & start
pkrusset.addLoop( move.loop );
pkrusset.addStart( move.start );