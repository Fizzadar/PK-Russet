/*
    file: js/shared/calculation.js
    desc: calculation functions
*/

var calculation = {
    //calculate hp
    hp: function( iv, base, level ) {
        return Math.round( ( ( iv + 2 ) * base * level / 100 ) + 10 + level );
    },

    //calculate other stats
    stat: function( iv, base, level ) {
        return Math.round( ( ( iv + 2 * base ) * level / 100 ) + 5 );
    },

    //calculate damage
    damage: function( level, attack, defense, power, resistance ) {
        var stab = 1;
        if( !resistance ) resistance = 1;

        return Math.round( ( ( ( ( 2 * level / 5 + 2 ) * attack * power / defense ) / 50 ) + 2 ) * stab * resistance * ( 85 + Math.random() * 15 ) / 100 );
    }
};

try {
    module.exports = calculation;
} catch( e ) {}