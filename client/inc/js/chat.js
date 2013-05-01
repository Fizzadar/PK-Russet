var chat = {
	start: function() {
		//bind chat form
		$( 'form#pkrusset_chat' ).bind( 'submit', function( ev ) {
			ev.preventDefault();
			var el = $( 'input', $( ev.delegateTarget ) );
			if( el.val().length > 0 )
				network.map.sendChat( el.val() );

			el.val( '' );
		});

		return true;
	},

	//loop
	loop: function() {
		if( !network.map.server ) return;

		if( keyboard.down( 'enter' ) ) {
			var curTime = new Date().getTime();
			if( network.map.spaceTime < curTime ) {
				$( '#player form' ).toggle();
				if( $( '#player form' ).css( 'display' ) == 'block' ) {
					$( '#player form input' ).focus();
					move.disabled = true;
				} else {
					move.disabled = false;
				}
				network.map.spaceTime = curTime + 250;
			}
		}
	}
}

pkrusset.addStart( chat.start );
pkrusset.addLoop( chat.loop );