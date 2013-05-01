/*
    file: js/shared/new.js
    desc: shared file for creation of new accounts
*/

var cmds = {
    //choose first pokemon
    choose: function( user, d ) {
        if( user.pokemon.length > 0 ) return pkrusset.error( 'You already have pokemon!', user );
        if( !d.pokemon_id || ( d.pokemon_id != 1 && d.pokemon_id != 4 && d.pokemon_id != 7 ) ) return pkrusset.error( 'Invalid pokemon_id: ' + d.pokemon_id, user );

        //make pokemon
        var poke = pokemon.generate( d.pokemon_id, 10, true );
        poke.team = true;
        poke.team_lead = true;

        //assign pokemon
        user.pokemon[0] = poke;
        //complete
        server.completeCommand( 'choose_first_pokemon', poke );
    }
}

//add to commands
server.addCommand( 'choose_first_pokemon', cmds.choose );