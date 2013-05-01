/*
	file: js/loader.js
	desc: loads stuff
*/

var loader = {
	//hide
	hide: function() {
		$( 'div#loader' ).fadeOut( 200 );
	},

	//show
	show: function() {
		$( 'div#loader' ).fadeIn( 200 );
	}
}