/*
	file: js/map.js
	desc: draw/load map/canvas element, only does visaul map/canvas manip, no movement
*/

var map = {
	//canvas element
	element: null,
	//canvas context
	canvas: null,
	//loaded tiles
	tiles: {},
	//edge points (maps saved in editor format, edge points help to scale down to drawn size)
	lowX: 9999,
	lowY: 9999,
	highX: 0,
	highY: 0,
	level: 0,
	//timer on which to calculate overmap objects
	overmapTimer: 0,

	//loop
	loop: function() {
		if( map.disabled ) return;

		//get time
		var curTime = new Date().getTime() + 1;

		//too early?
		if( curTime < map.overmapTimer )
			return;

		//clear
		$( '#overmap' ).empty();

		//loop all map tiles
		for( var i = 0; i < data.map.tiles.length; i++ ) {
			var tile = data.map.tiles[i];
			var obj = map.getTile( tile.tile );
			//skip small objects
			if( obj.width < 64 || obj.height < 64 )
				continue;
			//work out height in terms of block position
			var height = Math.round( obj.height / 32 / 2 );
			//difference
			var diffX = Math.abs( data.player.xpos - tile.xpos );
			var diffY = Math.abs( data.player.ypos - tile.ypos );
			//only match close elements at certain ypos
			if( diffX < 20 && diffY < 20 && ( tile.ypos + height ) > data.player.ypos )
				$( '#overmap' ).append( '<img src="_inc/img/tiles/enlarged/' + tile.tile + '.png" style="margin-left:' + ( tile.xpos * 32 ) + 'px;margin-top:' + ( tile.ypos * 32 ) + 'px;" />' );
		}

		//set timer
		map.overmapTimer = curTime + 100;
	},

	//start map
	start: function() {
		//set element, width, height
		map.element = document.getElementById( 'map' );
		map.element.width = data.map.width * 32;
		map.element.height = data.map.height * 32;

		//make sure we can use canvas
		if( map.element.getContext ) {
			map.canvas = map.element.getContext( '2d' );
		} else {
			return pkrusset.logError( 'Could not get canvas context' );
		}

		pkrusset.log( 'Map started' );
		return true;
	},

	//calculate map edge points
	edgePoints: function() {
		//reset edge points
		this.lowX = 9999;
		this.lowY = 9999;
		this.highX = 0;
		this.highY = 0;

		//loop tiles, work out low x,y and high x,y
		for( var i = 0; i < data.map.tiles.length; i++ ) {
			var tile = data.map.tiles[i];
			var width = this.getTile( tile.tile ).width / 32;
			var height = this.getTile( tile.tile ).height / 32;

			if( tile.xpos < this.lowX )
				this.lowX = tile.xpos;

			if( tile.ypos < this.lowY )
				this.lowY = tile.ypos;

			if( tile.xpos + width > this.highX )
				this.highX = tile.xpos + width;

			if( tile.ypos + height > this.highY )
				this.highY = tile.ypos + height;
		}
	},

	//get tile
	getTile: function( tile ) {
		//already have tile image?
		if( this.tiles[tile] ) {
			img = this.tiles[tile];
		} else {
			var img = new Image();
			img.src = '_inc/img/tiles/enlarged/' + tile + '.png';
			this.tiles[tile] = img;
		}

		return img;
	},

	//add tile to map
	addTile: function( tile, x, y ) {
		//draw it
		this.canvas.drawImage( this.getTile( tile ), 32 * x, 32 * y, this.getTile( tile ).width, this.getTile( tile ).height );
	},

	//load map from data.map.tiles
	load: function() {
		//clear the map
		this.canvas.clearRect( 0, 0, this.element.width, this.element.height );

		//loop tiles, add
		for( var i = 0; i < data.map.tiles.length; i++ )
			if( data.map.tiles[i].level == this.level )
				this.addTile( data.map.tiles[i].tile, data.map.tiles[i].xpos, data.map.tiles[i].ypos );
	},

	//load a map from a file
	loadFile: function( file, callback ) {
		$.ajax({
			cache: false,
			async: false,
			dataType: "json",
			url: '_inc/data/maps/' + file + '.json',
			success: function( d ) {
				data.map = d;
				map.resize();
				if( callback ) callback();
			},
			error: function( obj, status, err ) {
				map.log( 'Error loading map ' + file + ': ' + err );
			}
		});
	},

	//go up a level
	upLevel: function() {
		this.level++;
		this.load();
	},
	//go down a level
	downLevel: function() {
		this.level--;
		this.load();
	},

	//resize map to actual size
	resize: function() {
		//dont do for empty maps, just start
		if( data.map.tiles.length == 0 )
			return map.start();

		//do edge points
		map.edgePoints();

		//change all tiles
		for( var i = 0; i < data.map.tiles.length; i++ ) {
			data.map.tiles[i].xpos -= map.lowX;
			data.map.tiles[i].ypos -= map.lowY;
		}
		//change all blocks
		var newblocks = {};
		$.each( data.map.blocks, function( k, block ) {
			block.xpos -= map.lowX;
			block.ypos -= map.lowY;
			newblocks[block.xpos + '_' + block.ypos] = block;
		});
		data.map.blocks = newblocks;

		//set map width
		data.map.width = map.highX - map.lowX;
		data.map.height = map.highY - map.lowY;

		//start & reload
		map.start();
		map.load();

		return true;
	}
}

//add resize as start (editor overrides this)
pkrusset.addStart( map.resize );
pkrusset.addLoop( map.loop );