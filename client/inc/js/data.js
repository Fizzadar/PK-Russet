/*
	file: js/data.js
	desc: generic data structure for common bits
*/

var data = {
	maps: [],
	pokemon: [],
	moves: [],
	items: {},

	//default map data
	map: {
		width: 0,
		height: 0,
		tiles: [],
		blocks: {}
	},

	//default player data
	player: {
		xpos: 17,
		ypos: 13,
		image: 0,
		map: 'russet_village',
		pokemon: [],
		items: [ 'potion', 'potion', 'potion', 'poke_ball' ],
		battle: false //key linked to specific battle
	},

	//battle
	battle: {
		player_team: [],
		enemy_team: []
	},

	//default pokemon data
	pokemon: {
		pokemon_id: 0,
		name: 'Unknown', //set by player
		team: true, //in team?
		team_lead: true, //team leader?
		experience: 0,
		level: 0,
		hp: 0,
		moves: {
			one: {
				id: 0,
				pp: 30
			},
			two: {
				id: 1,
				pp: 30
			},
			three: {
				id: 1,
				pp: 30
			},
			four: {
				id: 1,
				pp: 30
			}
		},
		stats: {
			attack: 0,
			defense: 0,
			sAttack: 0,
			sDefence: 0,
			speed: 0,
			hp: 0
		}
	},

	//add item
	addItem: function( key, item ) {
		this.items[key] = item;
	},
	//get item
	getItem: function( key ) {
		return this.items[key];
	},

	//loadmap
	loadMap: function( file ) {
		if( this.maps[file] ) return this.maps[file];

		$.ajax({
			cache: false,
			async: false,
			dataType: 'json',
			url: 'inc/data/maps/' + file + '.json',
			success: function( d ) {
				data.maps[file] = d
			},
			error: function( err ) {
				pkrusset.error( err );
			}
		});

		if( this.maps[file] )
			return this.maps[file];
		else
			return false;
	},

	//load move
	loadMove: function( id ) {
		if( this.moves[id] ) return this.moves[id];

		$.ajax({
			cache: false,
			async: false,
			dataType: 'json',
			url: 'inc/data/moves/' + id + '.json',
			success: function( d ) {
				data.moves[id] = d
			},
			error: function( err ) {
				pkrusset.error( err );
			}
		});

		if( this.moves[id] )
			return this.moves[id];
		else
			return false;
	},

	//load pokemon
	loadPokemon: function( id ) {
		if( this.pokemon[id] ) return this.pokemon[id];

		$.ajax({
			cache: false,
			async: false,
			dataType: 'json',
			url: 'inc/data/pokemon/' + id + '.json',
			success: function( d ) {
				data.pokemon[id] = d
			},
			error: function( err ) {
				pkrusset.error( err );
			}
		});

		if( this.pokemon[id] )
			return this.pokemon[id];
		else
			return false;
	},

	//start (load types, stats, experience)
	start: function() {
		$.ajax({
			cache: false,
			async: false,
			dataType: 'json',
			url: 'inc/data/experience.json',
			success: function( d ) {
				data.experience = d;
			}
		});
		$.ajax({
			cache: false,
			async: false,
			dataType: 'json',
			url: 'inc/data/stats.json',
			success: function( d ) {
				data.stats = d;
			}
		});
		$.ajax({
			cache: false,
			async: false,
			dataType: 'json',
			url: 'inc/data/types.json',
			success: function( d ) {
				data.types = d;
			}
		});

		return true;
	}
}

pkrusset.addStart( data.start );