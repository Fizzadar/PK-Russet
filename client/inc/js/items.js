/*
    normal items (battle and non-battle)
*/

var items = {
    //potion
    potion: {
        image: 'potion',
        name: 'Potion',
        func: function( pk ) {
            var basepk = data.loadPokemon( pk.pokemon_id );
            var maxhp = calculation.hp( pk.stats.hp, basepk.stats.hp, pk.level );
            pk.hp += 20;
            if( pk.hp > maxhp ) pk.hp = maxhp;

            return pk.name + ' gainted 20 hp';
        }
    }
}

data.addItem( 'potion', items.potion );