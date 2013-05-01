/*
	file: js/editor.js
	desc: editor functions, on top of core game
*/

//set map width/height initial
data.map.width = pkrusset.windowWidth = Math.floor( ( $( window ).width() - 360 ) / 32 );
data.map.height = pkrusset.windowHeight = Math.floor( ( $( window ).height() - 64 ) / 32 );

var editor = {
	//editor vars
	preview: null,
	tile: null,
	block: null,
	level: 0,
	xpos: 0,
	ypos: 0,
	active: true,
	redoQueue: [],
	drawing: false,

	//log
	log: function( text ) {
		console.log( '[PK Editor]: ' + text );
	},

	//start editor
	start: function() {
		//stop move
		move.disabled = true;
		//stop map
		map.disabled = true;

		//load old map?
		if( localStorage.getItem( 'pkrusset_map' ) ) {
			//localstorage
			data.map = JSON.parse( localStorage.getItem( 'pkrusset_map' ) );
			//get edge points, resize map
			map.edgePoints();
			//resize if map bigger than what we've set
			data.map.width = data.map.width < map.highX ? map.highX + 1 : data.map.width;
			data.map.height = data.map.height < map.highY ? map.highY + 1 : data.map.height;
			//set size & load tiles
			map.start();
			map.load();
			editor.drawBlocks();
		}

		//make top level tile category buttons
		$.each( editor.tiles, function( name, cats ) {
			//add button
			$( '#edit_sidebar #folders' ).append( '<button onclick="editor.showTileFolder( \'' + name + '\' );" id="folder_button_' + name + '">' + name + '</button>' );
		});

		//set tiles height
		$( '#edit_sidebar #tiles' ).height( $( window ).height() - 159 );

		//set preview
		editor.preview = $( '#edit_preview' );

		//mousemove bind
		$( document ).bind( 'mousemove', function() {
			/* from: http://www.quirksmode.org/js/events_properties.html */
			var xpos = 0;
			var ypos = 0;
			if (!e) var e = window.event;
			if (e.pageX || e.pageY) 	{
				xpos = e.pageX;
				ypos = e.pageY;
			}
			else if (e.clientX || e.clientY) 	{
				xpos = e.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
				ypos = e.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
			}

			//work out position blocks
			editor.xpos = Math.floor( xpos / 32 );
			editor.ypos = Math.floor( ( ypos - 40 ) / 32 );

			//move preview to this block
			editor.preview.css( 'left', editor.xpos * 32 + 'px' );
			editor.preview.css( 'top', editor.ypos * 32 + 'px' );

			//are we drawing?
			if( editor.tile && editor.drawing && data.map.tiles.length > 0 ) {
				var lastTile = data.map.tiles[data.map.tiles.length - 1];
				if( lastTile.xpos != editor.xpos || lastTile.ypos != editor.ypos ) {
					editor.addTile( editor.xpos, editor.ypos );
				}
			}
		});

		//mouse down bind on preview
		editor.preview.bind( 'mousedown', function( ev ) {
			//hide preview
			editor.preview.hide();

			//add our tile
			editor.add( editor.xpos, editor.ypos );

			//set drawing true
			editor.drawing = true;
		});

		//mouse up bind on map
		$( map.element ).bind( 'mouseup', function( ev ) {
			//set drawing false
			editor.drawing = false;

			//show preview
			editor.preview.show();
		});

		//bind buttons
		$( 'button#extend_width' ).bind( 'click', function() {
			editor.increaseWidth();
		});
		$( 'button#extend_height' ).bind( 'click', function() {
			editor.increaseHeight();
		});
		$( 'button#redo' ).bind( 'click', function() {
			editor.redo();
		});
		$( 'button#undo' ).bind( 'click', function() {
			editor.undo();
		});
		$( 'button#block_mode' ).bind( 'click', function() {
			editor.blockMode();
		});
		$( 'button#tile_mode' ).bind( 'click', function() {
			editor.tileMode();
		});
		$( 'button#up_level' ).bind( 'click', function() {
			map.upLevel();
			editor.level++;
			editor.drawBlocks();
		});
		$( 'button#down_level' ).bind( 'click', function() {
			map.downLevel();
			editor.level--;
			editor.drawBlocks();
		});
		$( 'button#test_map' ).bind( 'click', function() {
			editor.testMap();
		});
		$( 'button#export' ).bind( 'click', function() {
			editor.export();
		});

		$( '#map' ).bind( 'click', function() {
			console.log( 'X: ' + editor.xpos + ', Y: ' + editor.ypos );
		})

		//start with buildings
		editor.showTileFolder( 'buildings' );

		//log
		editor.log( 'Started' );

		loader.hide();

		return true;
	},

	//show tile folder
	showTileFolder: function( folder ) {
		var tilediv = $( '#edit_sidebar #tiles' );

		//hide current stuff
		tilediv.empty();

		$.each( editor.tiles[folder], function( category, tiles ) {
			tilediv.append( '<h5>' + folder + ': ' + category );
			for( var i = 0; i < tiles.length; i++ ) {
				tilediv.append( '<img class="tile" id="' + folder + '/' + category + '/' + tiles[i] + '" src="_inc/img/tiles/enlarged/' + folder + '/' + category + '/' + tiles[i] + '.png" />' );
			}
		});

		//bind the tiles
		$( '#edit_sidebar #tiles img.tile' ).bind( 'click', function( ev ) {
			editor.selectTile( ev.target.id );
		});

		//change buttons
		$( '#edit_sidebar #folders button' ).removeClass( 'active' );
		$( '#edit_sidebar #folders #folder_button_' + folder ).addClass( 'active' );
	},

	//select a tile
	selectTile: function( tile ) {
		this.tile = tile;
		this.preview.attr( 'src', '_inc/img/tiles/enlarged/' + tile + '.png' );
		this.preview.show();

		this.log( 'Tile selected: ' + tile );
	},

	//deselect
	deselect: function() {
		this.tile = null;
		this.preview.attr( 'src', '_inc/img/blank.png' );
	},

	//add to map
	add: function( x, y ) {
		if( this.tile )
			this.addTile( x, y );
		else if( this.block )
			this.addBlock( x, y );
	},

	//draw blocks
	drawBlocks: function() {
		$( '#overmap' ).empty();
		$.each( data.map.blocks, function( k, block ) {
			if( block.level == editor.level )
				$( '#overmap' ).append( '<div class="block ' + block.block + '" style="margin-left:' + ( block.xpos * 32 ) + 'px;margin-top:' + ( block.ypos * 32 ) + 'px;background:' + editor.blocks[block.block].color + '">' + block.block + '</div>' );
		});
	},

	//add a block
	addBlock: function( x, y ) {
		$( '#overmap' ).append( '<div class="block ' + this.block + '" style="margin-left:' + ( x * 32 ) + 'px;margin-top:' + ( y * 32 ) + 'px;background:' + this.blocks[this.block].color + '">' + this.block + '</div>' );
		this.preview.show();

		var block_data = {};
		if( this.blocks[this.block].data ) {
			for( var i = 0; i < this.blocks[this.block].data.length; i++ ) {
				var d = prompt( 'Enter data ' + this.blocks[this.block].data[i] );
				block_data[this.blocks[this.block].data[i]] = d;
			}
		}

		//add to list
		data.map.blocks[x + '_' + y] = {
			block: this.block,
			xpos: x,
			ypos: y,
			level: this.level,
			data: block_data
		}

		//save to localstorage
		localStorage.setItem( 'pkrusset_map', JSON.stringify( data.map ) );
	},

	//add a tile
	addTile: function( x, y ) {
		//loop all current tiles to make sure we've not duplicated (too slow?)
		for( var i = 0; i < data.map.tiles.length; i++ ) {
			var tile = data.map.tiles[i];
			if( tile.xpos == x && tile.ypos == y && tile.tile == this.tile )
				return;
		}

		//draw tile
		map.addTile( this.tile, x, y );

		//add to data array
		data.map.tiles[data.map.tiles.length] = {
			tile: this.tile,
			xpos: x,
			ypos: y,
			level: this.level
		}

		//empty redo queue
		this.redoQueue = [];

		//save to localstorage
		localStorage.setItem( 'pkrusset_map', JSON.stringify( data.map ) );

		this.log( 'Tile added: ' + this.tile + ', x: ' + x + ', y: ' + y );
	},

	//tile mode
	tileMode: function() {
		$( '#overmap' ).hide();
		$( '#edit_sidebar #block_mode' ).removeClass( 'active' );
		$( '#edit_sidebar #tile_mode' ).addClass( 'active' );
		$( '#edit_sidebar #folders' ).show();
		$( 'button#undo' ).css( 'opacity', 1 );
		$( 'button#redo' ).css( 'opacity', 1 );
		this.showTileFolder( 'buildings' );
		this.deselect();
	},

	//block mode
	blockMode: function() {
		$( '#edit_sidebar #tile_mode' ).removeClass( 'active' );
		$( '#edit_sidebar #block_mode' ).addClass( 'active' );
		$( '#edit_sidebar #folders' ).hide();
		$( '#edit_sidebar #tiles' ).empty();
		$( 'button#undo' ).css( 'opacity', 0 );
		$( 'button#redo' ).css( 'opacity', 0 );
		$( '#overmap' ).show();
		this.deselect();

		//loop blocks, add to sidebar
		$.each( this.blocks, function( k, v ) {
			$( '#edit_sidebar #tiles' ).append( '<button class="block color_' + v.color + '" data-block="' + k + '">' + k + '</button>' );
		});
		//bind them
		$( '#tiles button.block' ).bind( 'click', function( ev ) {
			editor.selectBlock( $( ev.target ).attr( 'data-block' ) );
		});
	},

	//select block
	selectBlock: function( block ) {
		this.preview.css( { background: this.blocks[block].color });
		this.block = block;
		this.log( 'Block selected: ' + block );
	},

	//testmap
	testMap: function() {
		if( move.disabled ) {
			move.disabled = false;
			map.disabled = false;
			move.moveTo( pkrusset.windowWidth / 2, pkrusset.windowHeight / 2 );
			$( '#player' ).css( 'display', 'block' );
			$( 'body' ).scrollLeft( 0 ).scrollTop( 0 ).css( 'overflow', 'hidden' );
		} else {
			move.disabled = true;
			map.disabled = true;
			$( '#player' ).css( 'display', 'none' );
			$( 'body' ).css( 'overflow', 'auto' );
		}
	},

	//export
	export: function() {
		if( $( '#edit_export' ).css( 'display' ) == 'none' ) {
			$( '#edit_export' ).show();
			$( '#edit_export' ).html( JSON.stringify( data.map ) );
		} else {
			$( '#edit_export' ).hide();
		}
	},

	//redo
	redo: function() {
		if( !this.redoQueue[this.redoQueue.length - 1] )
			return false;

		//get from redo
		data.map.tiles[data.map.tiles.length] = this.redoQueue[this.redoQueue.length - 1];
		//remove redo
		this.redoQueue.splice( -1, 1 );

		//refresh map
		map.start();
		map.load();

		//save to localstorage
		localStorage.setItem( 'pkrusset_map', JSON.stringify( data.map ) );

		this.log( 'Redone' );
	},

	//undo
	undo: function() {
		if( !data.map.tiles[data.map.tiles.length - 1] )
			return false;

		//add to redo
		this.redoQueue[this.redoQueue.length] = data.map.tiles[data.map.tiles.length - 1];

		//take off saved tiles
		data.map.tiles.splice( -1, 1 );

		//refresh map
		map.start();
		map.load();

		//save to localstorage
		localStorage.setItem( 'pkrusset_map', JSON.stringify( data.map ) );

		this.log( 'Undone' );
	},

	//increase width
	increaseWidth: function() {
		data.map.width += 20;
		map.start();
		map.load();

		this.log( 'Width increased' );
	},

	//increase height
	increaseHeight: function() {
		data.map.height += 20;
		map.start();
		map.load();

		this.log( 'Height increased' );
	}
}

//add start & loop
pkrusset.addStart( editor.start );