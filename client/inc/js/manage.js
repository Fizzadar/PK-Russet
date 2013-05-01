/*
    file: js/manage.js
    desc: manage pokemon
*/

var manage = {
    container: null,
    highlight_id: 0,

    //start
    start: function() {
        $( '.pkrusset_manage' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            manage.toggle();
        });

        //bind battle tabs
        $( '#manage_container .tabs li[data-tab]' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            manage.switchTab( $( ev.target ).parent().attr( 'data-tab' ) );
        });

        //get container
        manage.container = $( '#manage_container' );

        return true;
    },

    //show/hide
    toggle: function() {
        if( this.container.css( 'display' ) == 'none' )
            this.open();
        else
            this.close();
    },

    //switch tab
    switchTab: function( tab ) {
        //tabs
        $( '.tabs li', this.container ).removeClass( 'active' );
        $( '.tabs li[data-tab=' + tab + ']', this.container ).addClass( 'active' );
        //contents
        $( '.tab', this.container ).hide();
        $( '.' + tab, this.container ).show();
    },

    //open
    open: function() {
        move.disabled = true;
        map.disabled = true;

        //add each pokemon
        $( 'table tbody', this.container ).empty();
        for( var i = 0; i < data.player.pokemon.length; i++ ) {
            //our pokemon
            var pk = data.player.pokemon[i];
            //base pokemon
            var basepk = data.loadPokemon( pk.pokemon_id );
            //work out hp max
            var maxhp = calculation.hp( pk.stats.hp, basepk.stats.hp, pk.level );
            //types
            var types = '';
            for( var j = 0; j < basepk.types.length; j++ )
                types += '<img src="inc/img/types/' + data.types[basepk.types[j]] + '.png" />';
            //team
            var team = '';
            if( pk.team ) {
                team += '<a href="#" class="manage_team_remove" data-id="' + i + '">Remove from team</a>';
                if( !pk.team_lead )
                    team += ' <a href="#" class="manage_team_leader" data-id="' + i + '">Make leader</a>';
            } else {
                team = '<a href="#" class="manage_team_add" data-id="' + i + '">Add to team</a>';
            }
            //experience
            var exp = data.experience[basepk.growth_rate][pk.level + 1];

            //go!
            $( 'table.pokemon tbody', this.container ).append( '\
                <tr>\
                    <td><img class="icon" src="inc/img/pokemon/front/' + pk.pokemon_id + '.png" /></td>\
                    <td>' + pk.name + '</td>\
                    <td>' + types + '</td>\
                    <td>' + pk.hp + ' / ' + maxhp + '</td>\
                    <td>' + pk.level + '</td>\
                    <td>' + pk.experience + ' / ' + exp + '</td>\
                    <td><a href="#" class="manage_view" data-id="' + i + '">View</a> ' + team + '</td>\
                </tr>\
            ' );
        }

        //bind links
        $( 'a.manage_view' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            manage.highlight( $( ev.target ).attr( 'data-id' ) );
            manage.switchTab( 'stats' );
        });
        $( 'a.manage_team_add' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            manage.teamAdd( $( ev.target ).attr( 'data-id' ) );
        });
        $( 'a.manage_team_remove' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            manage.teamRemove( $( ev.target ).attr( 'data-id' ) );
        });
        $( 'a.manage_team_leader' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            manage.teamLead( $( ev.target ).attr( 'data-id' ) );
        });

        this.container.show();
    },

    //close
    close: function() {
        this.container.hide();

        map.disabled = false;
        move.disabled = false;
    },

    //reload (highlight)
    reload: function() {
        this.highlight( this.highlight_id );
    },

    //highlight individual pokemon
    highlight: function( id ) {
        this.highlight_id = id;

        var pk = data.player.pokemon[id];
        var basepk = data.loadPokemon( pk.pokemon_id );
        $( 'div.pokemon img.pokemon', this.container ).attr( 'src', 'inc/img/pokemon/front/' + pk.pokemon_id + '.png' );

        //draw stats
        $( '.stats table tbody', this.container ).empty();
        $.each( pk.stats, function( k, v ) {
            $( '.stats table tbody', this.container ).append( '<tr><td>' + k + '</td><td>' + v + '</td></tr>' );
        });
        //draw moves
        $( '.moves ul.moves', this.container ).empty();
        $.each( pk.moves, function( k, v ) {
            if( !v ) {
                $( '.moves ul.moves', this.container ).append( '<li><a href="#" class="learn_move" data-move="' + k + '">Learn new move...</a></li>' );
            } else {
                var move = data.loadMove( v.id );
                $( '.moves ul.moves', this.container ).append( '<li>' + move.name + ' <span>' + v.pp + ' / ' + move.pp + 'pp</span> <a href="#" class="delete_move small" data-move="' + k + '">delete</a></li>' );
            }
        });
        //evolves to
        if( basepk.evolves_to ) {
            var evolvepk = data.loadPokemon( basepk.evolves_to.id );
            $( '.evolution img', this.container ).attr( 'src', 'inc/img/pokemon/front/' + basepk.evolves_to.id + '.png' );

            $( '.evolution div', this.container ).html( pk.name + ' can evolve to ' + evolvepk.name );
            if( basepk.evolves_to.level <= pk.level )
                $( '.evolution div', this.container ).append( ' <a href="#">evolve now</a>' );
            else
                $( '.evolution div', this.container ).append( ' at level ' + basepk.evolves_to.level );
        }

        //bind delete moves
        $( 'ul.moves .delete_move', this.container ).bind( 'click', function( ev ) {
            ev.preventDefault();
            manage.deleteMove( $( ev.delegateTarget ).attr( 'data-move' ) );
        });
        //bind learn moves
        $( 'ul.moves .learn_move', this.container ).bind( 'click', function( ev ) {
            ev.preventDefault();
            manage.learnMove( $( ev.delegateTarget ).attr( 'data-move' ) );
        });

        //remove any newmoves
        $( '.moves ul.newmoves', this.container ).empty();
    },

    //delete move
    deleteMove: function( move ) {
        var pk = data.player.pokemon[this.highlight_id];
        if( pk.moves[move] )
            pk.moves[move] = false;

        this.reload();
    },

    //learn move
    learnMove: function( move ) {
        var pk = data.player.pokemon[this.highlight_id];
        if( !pk.moves[move] ) {
            $( '.moves ul.newmoves', this.container ).empty();
            var basepk = data.loadPokemon( pk.pokemon_id );
            $.each( basepk.moves, function( k, v ) {
                if( pk.level >= v ) {
                    var m = data.loadMove( k );
                    $( '.moves ul.newmoves', this.container ).append( '<li>' + m.name + ' <span>' + m.pp + 'pp</span> <a href="#" class="learn_new_move" data-newmove="' + k + '" data-move="' + move + '">learn</a></li>' );
                }
            });

            //bind
            $( '.moves .learn_new_move', this.container ).bind( 'click', function( ev ) {
                ev.preventDefault();
                manage.learnNewMove( $( ev.delegateTarget ).attr( 'data-move' ), $( ev.delegateTarget ).attr( 'data-newmove' ) );
            });
        }
    },

    //actually learn move
    learnNewMove: function( move_pk, move_id ) {
        var pk = data.player.pokemon[this.highlight_id];
        var basepk = data.loadPokemon( pk.pokemon_id );
        if( pk.moves[move_pk] == false ) {
            var move = data.loadMove( move_id );
            //level check
            if( pk.level >= basepk.moves[move_id] ) {
                pk.moves[move_pk] = { id: move_id, pp: move.pp };
                //reload
                this.reload();
            }
        }
    },

    //add to team
    teamAdd: function( id ) {
        var count = 0;
        for( var i = 0; i < data.player.pokemon.length; i++ )
            if( data.player.pokemon[i].team )
                count++;

        if( count >= 6 )
            return pkrusset.error( 'Too many team members' );

        data.player.pokemon[id].team = true;
        this.open();
    },

    //remove from team
    teamRemove: function( id ) {
        //remove from team
        data.player.pokemon[id].team = false;
        data.player.pokemon[id].team_lead = false;
        //reload
        this.open();
    },

    //change team leader
    teamLead: function( id ) {
        //loop pokemon, make all not leader
        for( var i = 0; i < data.player.pokemon.length; i++ )
            data.player.pokemon[i].team_lead = false;

        //make our specified the leader
        data.player.pokemon[id].team_lead = true;

        //reload
        this.open();
    }
};

pkrusset.addStart( manage.start );