/*
    battle only items
*/

items.battle = {
    //basic ball
    poke_ball: {
        battleOnly: true,
        image: 'poke-ball',
        name: 'Poke Balll',
        func: function( b ) {
            console.log( b );
        }
    }
}

data.addItem( 'poke_ball', items.battle.poke_ball );