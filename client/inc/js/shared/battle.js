/*
    file: js/shared/battle.js
    desc: shared file for battle functions
*/

var cmds = {
    //request a battle
    wildRequest: function( user, d ) {
        //quick n' dirty
        var error = function( error ) {
            return server.completeCommand( 'request_wild_battle', { error: error } );
        }

        if( user.battle ) return error( 'You are already in battle!' );

        //prepare pokemon for battle (calculate stats)
        var prepare = function( pk, check ) {
            var out = [];
            var remove = [];
            for( var i = 0; i < pk.length; i++ ) {
                if( check && ( pk[i].hp <= 0 || !pk[i].team ) ) continue;

                //load data
                var pkdata = data.loadPokemon( pk[i].pokemon_id );
                pk[i].battleStats = {};
                for( var k in pk[i].stats )
                    if( k == 'hp' )
                        pk[i].battleStats[k] = calculation.hp( pk[i].stats[k], pkdata.stats[k], pk[i].level );
                    else
                        pk[i].battleStats[k] = calculation.stat( pk[i].stats[k], pkdata.stats[k], pk[i].level );

                //add to out
                out.push( pk[i] );
                //remove from pk (readded to player after battle)
                pk.splice( i, 1 );
                //because of splice, reduce i
                i--;
            }

            return out;
        }

        //prepare our pk
        player_pk = prepare( user.pokemon, true );

        //no pokemon?
        if( player_pk.length <= 0 ) return error( 'No alive pokemon in team!' );
        if( player_pk.length > 6 ) return error( 'Too many pokemon in team! Reduce to 6 in manager' );

        //locate our team leader (default 0)
        var player_leader = 0;
        for( var i = 0; i < player_pk.length; i++ ) {
            if( player_pk[i].team_lead )
                player_leader = i;
        }

        //get map, split pokemon up
        var map = data.loadMap( user.map );
        var pks = map.pokemon.split( ',' );

        //work out level
        var level = Math.round( Math.random() * map.max_level );
        if( level < map.min_level ) level = map.min_level;

        //number of enemies?
        var n = Math.round( ( Math.random() * 1 ) ) + 1,
            pk_id = Math.round( Math.random() * ( pks.length - 1 ) );
        //build enemy pk list
        var enemies = [];
        for( var i = 0; i < n; i++ ) {
            enemies.push( pokemon.generate( pks[pk_id], level ) );
        }

        //calculate stats
        enemy_pk = prepare( enemies );

        //build battle
        var battle = {
            type: 'wild',
            active_player: player_leader,
            player_team: player_pk,
            active_enemy: 0,
            enemy_team: enemy_pk,
            log: [{ text: n + ' x Wild ' + enemy_pk[0].name + ', lvl ' + enemy_pk[0].level + ' appeared!' } ]
        };

        //assign user a battle
        if( pkrusset.server ) {
                /*
                define key for battle
                set user.battle = key
                set user.battleTrainer = 'player' //when pvp second person is set to enemy, used in all functions outside this
                INSERT battle => battles array
                */
        }

        //complete
        server.completeCommand( 'request_wild_battle', battle );
    },

    //make attack on battle
    battleMove: function( user, d ) {
        //quick n' dirty
        var error = function( error ) {
            return server.completeCommand( 'battle_move', { error: error } );
        }
        //actual attack function
        var attack = function( player, enemy, move_id ) {
            //fail if no move or pp
            if( !player.moves[move_id] || player.moves[move_id].pp <= 0 )
                return error( 'Not enough PP' );

            //get move, other bits
            var move = data.loadMove( player.moves[move_id].id ),
                damaged = false,
                effected = false;

            //log the move
            log.push( { text: player.name + ' used ' + move.name } );

            //remove pp
            player.moves[move_id].pp -= 1;
            //has contributed (for EXP)
            player.contributed = true;

            //get attack/defense stat dependant on damange type
            if( move.damage_class_id == 2 )
                var attack = player.battleStats.attack,
                    defense = player.battleStats.defense;
            else
                var attack = player.battleStats.sattack,
                    defense = player.battleStats.sdefense;

            //calculate damage
            var damage = 0;
            if( move.damage_class_id > 1 ) damage = calculation.damage( player.level, attack, defense, move.power );

            //do stat effects
            if( Object.size( move.stat_effects ) > 0 && ( move.stat_chance == 0 || Math.random() * 100 > move.stat_chance ) ) {
                for( var k in move.stat_effects ) {
                    //target self?
                    if( move.target_id == 7 ) {
                        player.battleStats[k] += move.stat_effects[k];
                        log.push( { text: player.name + ' gained ' + move.stat_effects[k] + ' ' + k } );
                    } else {
                        enemy.battleStats[k] += move.stat_effects[k];
                        log.push( { text: enemy.name + ' lost ' + move.stat_effects[k] + ' ' + k } );
                    }
                    //stats were effected
                    effected = true;
                }
            }

            //do damage
            if( damage > 0 ) {
                //do the damage
                enemy.hp -= damage;
                if( enemy.hp < 0 ) enemy.hp = 0;
                //log
                log.push( ( { text: enemy.name + ' lost ' + damage + 'HP' } ) );
                //damage
                damaged = true;
            }

            //nothing happen?
            if( !effected && !damaged )
                log.push( ( { text: 'Nothing happened!' } ) );

            //check to see if dead
            check();
        }
        //swap team members
        var swap = function( pokemon_id ) {
            if( b.player_team[pokemon_id].hp > 0 ) {
                log.push( { text: 'Return ' + player_pk.name } );
                b.active_player = pokemon_id;
                player_pk = b.player_team[pokemon_id];
                log.push( { text: 'Go ' + player_pk.name } );
            } else {
                return error( 'This pokemon has fainted!' );
            }
        }
        //use an item
        var doitem = function( item_id ) {
            //check user has item
            if( !user.items[item_id] ) return error( 'No item found!' );
            //get item
            var item = data.getItem( user.items[item_id] );
            //apply item function to pokemon/battle
            var text;
            if( item.battleOnly )
                text = item.func( b );
            else
                text = item.func( player_pk );
            //log?
            if( text ) log.push( { text: text } );
            //remove item
            user.items.splice( item_id, 1 );
        }
        //check individual pokemon
        var checkPokemon = function( pokemon_id, team ) {
            var pokemon = team[pokemon_id];
            if( pokemon.hp <= 0 ) {
                log.push( { text: pokemon.name + ' fainted!' } );
                //sample team, locate replacement
                var replace = false;
                for( var i = 0; i < team.length; i++ ) {
                    if( team[i].hp > 0 ) {
                        replace = i;
                        break;
                    }
                }
                //ok?
                if( replace ) {
                    log.push( { text: 'Go ' + team[replace].name } );
                    return replace;
                } else {
                    return false;
                }
            }
            return pokemon_id;
        }
        //check teams
        var check = function() {
            //check player
             var pk = checkPokemon( b.active_player, b.player_team );
             if( pk === false )
                complete = true; //no more needed, rest is done in end
             else if( pk != b.active_player )
                b.active_player = pk;

            //check enemy
            pk = checkPokemon( b.active_enemy, b.enemy_team );
            if( pk === false )
                complete = true;
            else if( pk != b.enemy_player )
                b.active_enemy = pk;
        }



        //get battle data
        if( pkrusset.server ) {
            /*
            get battle using user's battle key
            get users pokemon and enemy pokemon by user.battleTrainer (ie swap player/enemy when needed)
            */
        } else {
            var b = battle.data;
        }

        //get player/enemy
        var player_pk = b.player_team[b.active_player],
            enemy_pk = b.enemy_team[b.active_enemy],
            log = [],
            complete = false;

        //attacking, using item or switching
        if( d.move )
            attack( player_pk, enemy_pk, d.move );
        else if( d.item_id )
            doitem( d.item_id );
        else if( d.pokemon_id )
            swap( d.pokemon_id );
        else
            return error( 'Invalid move' );

        //if wild, choose attack for enemy
        if( b.type == 'wild' && enemy_pk.hp > 0 ) {
            var moves = [];
            for( var k in enemy_pk.moves )
                if( enemy_pk.moves[k].pp > 0 )
                    moves[moves.length] = k;

            //if we have moves available, attack
            if( moves.length > 0 ) {
                var move = moves[Math.round( Math.random() * ( moves.length - 1 ) )];
                //attack
                attack( enemy_pk, player_pk, move );
            }
        }

        //complete?
        if( complete ) b.complete = complete;

        //overwrite battle
        if( pkrusset.server ) {
            //overwrite battle using battle key w/ user
        }

        //send battle + log to client
        server.completeCommand( 'battle_move', { battle: b, log: log, complete: complete } );
    },

    //end battle
    battleEnd: function( user, d ) {
        //quick n' dirty
        var error = function( error ) {
            return server.completeCommand( 'battle_end', { error: error } );
        }

        var win = false;

        //get battle data
        if( pkrusset.server ) {
            /*
            get battle using user's battle key
            get users pokemon and enemy pokemon by user.battleTrainer (ie swap player/enemy when needed)
            */
        } else {
            var b = battle.data;
        }

        //get player/enemy
        var player_pk = b.player_team[b.active_player],
            enemy_pk = b.enemy_team[b.active_enemy],
            log = [];

        //count alive players/enemies
        var alive_players = 0,
            enemy_players = 0;

        //dont count if running (loose)
        if( !d.running ) {
            for( var i = 0; i < b.player_team.length; i++ )
                if( b.player_team[i].hp > 0 )
                    alive_players++;
            for( var i = 0; i < b.enemy_team.length; i++ )
                if( b.enemy_team[i].hp > 0 )
                    enemy_players++;
        }

        //both teams have alive pk? fail
        if( alive_players > 0 && enemy_players > 0 ) return error( 'There are alive pokemon on both teams!' );
        //we won!
        if( alive_players > 0 ) win = true;


        //process end of battle
        //win - exp for our team
        if( win ) {
            var wild = 1;
            if( b.type != 'wild' ) wild = 1.5; //1.5 for pvp & trainers
            var exp = 0;
            //loop enemies, build up exp
            for( var i = 0; i < b.enemy_team.length; i++ )
                exp += (( data.loadPokemon( b.enemy_team[i].pokemon_id ).base_experience * b.enemy_team[i].level ) * wild ) / 7;

            //divide by our team
            exp = Math.round( exp / alive_players );

            //assign expereince to each
            for( var i = 0; i < b.player_team.length; i++ ) {
                //contributed + alive?
                if( b.player_team[i].hp > 0 && b.player_team[i].contributed ) {
                    b.player_team[i].experience = Number( exp ) + Number( b.player_team[i].experience );
                    log.push( { text: b.player_team[i].name + ' gained ' + exp + ' experience' } );

                    //did they level up?
                    var basepk = data.loadPokemon( b.player_team[i].pokemon_id );
                    if( b.player_team[i].experience > data.experience[basepk.growth_rate][b.player_team[i].level + 1] ) {
                        //increase level
                        b.player_team[i].level = Number( b.player_team[i].level ) + 1;
                        //reset pp
                        if( b.player_team[i].moves.one ) b.player_team[i].moves.one.pp = data.loadMove( b.player_team[i].moves.one.id ).pp;
                        if( b.player_team[i].moves.two ) b.player_team[i].moves.two.pp = data.loadMove( b.player_team[i].moves.two.id ).pp;
                        if( b.player_team[i].moves.three ) b.player_team[i].moves.three.pp = data.loadMove( b.player_team[i].moves.three.id ).pp;
                        if( b.player_team[i].moves.four ) b.player_team[i].moves.four.pp = data.loadMove( b.player_team[i].moves.four.id ).pp;
                        //award some stat points
                        var points = Math.round( Math.random() * 5 ),
                            stats = {};
                        for( var j = 0; j < points; j++ ) {
                            var stat = Math.round( Math.random() * 5 ) + 1;
                            if( stats[stat] )
                                stats[stat] += 1;
                            else
                                stats[stat] = 1;
                        }
                        //assign stats
                        for( key in stats ) {
                            b.player_team[i].stats[data.stats[key]] = Number( b.player_team[i].stats[data.stats[key]] ) + stats[key];
                            log.push( { text: data.stats[key] + ' increased by ' + stats[key] } );
                        }
                        //work out new hp
                        b.player_team[i].hp = Number( calculation.hp( b.player_team[i].stats.hp, basepk.stats.hp, b.player_team[i].level ) );
                        //log
                        log.push( { text: b.player_team[i].name + ' leveled up to lvl ' + b.player_team[i].level } );
                    }
                }
            }

            log.push( { text: 'You win!' } );
        } else {
            log.push( { text: 'You loose!' } );
        }

        //reassign players pokemon
        for( var i = 0; i < b.player_team.length; i++ ) {
            //remove battle-only stuff
            delete b.player_team[i].contributed;
            delete b.player_team[i].battleStats;

            user.pokemon.push( b.player_team[i] );
        }

        //return the battle
        return server.completeCommand( 'battle_end', { pokemon: b.player_team, log: log } );
    }
}

//if module exists we're node, if not browser
try {
    module.exports = {
        request_wild_battle: cmds.wildRequest,
        battle_move: cmds.battleMove,
        battle_end: cmds.battleEnd
    };
} catch( e ) {
    server.addCommand( 'request_wild_battle', cmds.wildRequest );
    server.addCommand( 'battle_move', cmds.battleMove );
    server.addCommand( 'battle_end', cmds.battleEnd );
}