/*
	file: js/keyboard.js
	desc: work out when keys up/down
*/

var keyboard = {
	//keys down
	keys: [],

	//nice key names => keyid's
	keyMap: {
		//wasd
		w: 87,
		a: 65,
		s: 83,
		d: 68,
		//arrows
		up: 38,
		left: 37,
		down: 40,
		right: 39,
		//other
		space: 32,
		shift: 16,
		enter: 13
	},

	//add key
	add: function( keyId ) {
		this.keys[keyId] = true;
	},

	//remove key
	remove: function( keyId ) {
		this.keys[keyId] = false;
	},

	//check if key is down
	down: function( key ) {
		var keyId = this.keyMap[key];
		return this.keys[keyId] == true;
	}
}

//bind keydowns
$( document ).keydown(function( evt ) {
	keyboard.add( evt.which );
});

//and keyups
$( document ).keyup( function( evt ) {
	keyboard.remove( evt.which );
});