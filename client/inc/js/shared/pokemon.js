/*
    file: js/pokemon.js
    desc: pokemon 'object' generation
*/

var pokemon = {
    generate: function( id, level, anyIV ) {
        //load pokemon
        var pk = data.loadPokemon( id );

        //iv multiplier
        var ivm = 30;
        if( !anyIV && level < 30 )
            ivm = level;

        //calculate iv value + hp
        var ivhp = Math.round( Math.random() * ivm );
        var hp = calculation.hp( ivhp, pk.stats.hp, level );
        //build pokemon
        var pokemon = {
            pokemon_id: id,
            name: pk.name,
            experience: data.experience[pk.growth_rate][level],
            level: level,
            hp: hp,
            moves: {
                one: false,
                two: false,
                three: false,
                four: false
            },
            stats: {
                attack: Math.round( Math.random() * ivm ),
                defense: Math.round( Math.random() * ivm ),
                sAttack: Math.round( Math.random() * ivm ),
                sDefense: Math.round( Math.random() * ivm ),
                speed: Math.round( Math.random() * ivm ),
                hp: ivhp
            }
        };
        //work out moves
        for( k in pk.moves ) {
            if( pk.moves[k] <= level ) {
                if( !pokemon.moves.one )
                    pokemon.moves.one = { id: k, pp: data.loadMove( k ).pp }
                else if( !pokemon.moves.two )
                    pokemon.moves.two = { id: k, pp: data.loadMove( k ).pp }
                else if( !pokemon.moves.three )
                    pokemon.moves.three = { id: k, pp: data.loadMove( k ).pp }
                else if( !pokemon.moves.four )
                    pokemon.moves.four = { id: k, pp: data.loadMove( k ).pp }
            }
        }

        //return
        return pokemon;
    }
}