var battle = {
    container: null,
    data: null,

    //start function
    start: function() {
        battle.container = $( '#battle_container' );

        //bind battle tabs
        $( '#battle_container .tabs li[data-tab]' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            battle.switchTab( $( ev.target ).parent().attr( 'data-tab' ) );
        });
        //bind run
        $( '#battle_container a.battle_run' ).bind( 'click', function( ev ) {
            ev.preventDefault();
            battle.run();
        });

        return true;
    },

    //switch tab
    switchTab: function( tab ) {
        if( this.disabled ) return;

        //tabs
        $( '.tabs li', this.container ).removeClass( 'active' );
        $( '.tabs li[data-tab=' + tab + ']', this.container ).addClass( 'active' );
        //contents
        $( '.tab', this.container ).hide();
        $( '.' + tab, this.container ).show();
    },

    //disable
    disable: function() {
        this.disabled = true;
        $( '.tabs li', this.container ).addClass( 'disabled' );
        $( '.battle_attack', this.container ).addClass( 'disabled' );
    },
    //enable
    enable: function() {
        this.disabled = false;
        $( '.tabs li', this.container ).removeClass( 'disabled' );
        $( '.battle_attack', this.container ).removeClass( 'disabled' );
    },

    //draw battle scene
    draw: function() {
        var player_pk = this.data.player_team[this.data.active_player];
        var enemy_pk = this.data.enemy_team[this.data.active_enemy];

        //draw player pokemon
        $( '#mine img', this.container ).attr( 'src', 'inc/img/pokemon/back/' + player_pk.pokemon_id + '.png' );
        $( '#mine img', this.container ).css( 'marginTop', ( Math.abs( data.loadPokemon( player_pk.pokemon_id ).height + 30 ) ) + 'px' );
        var hp = Math.round( player_pk.hp / player_pk.battleStats.hp * 100 );
        $( '#mine .hp div' ).css( 'width', hp + '%' );
        $( '#mine .hp div' ).html( player_pk.hp + '/' + player_pk.battleStats.hp );

        //draw enemy pokemon
        $( '#enemy img', this.container ).attr( 'src', 'inc/img/pokemon/front/' + enemy_pk.pokemon_id + '.png' );
        $( '#ememy img', this.container ).css( 'marginTop', ( Math.abs( data.loadPokemon( enemy_pk.pokemon_id ).height + 30 ) ) + 'px' );
        var hp = Math.round( enemy_pk.hp / enemy_pk.battleStats.hp * 100 );
        $( '#enemy .hp div' ).css( 'width', hp + '%' );
        $( '#enemy .hp div' ).html( enemy_pk.hp + '/' + enemy_pk.battleStats.hp );


        //draw our attack options
        $( '.attack', this.container ).empty();
        $.each( player_pk.moves, function( k, v ) {
            if( !v ) return;
            var move = data.loadMove( v.id );
            $( '.attack', this.container ).append( '<a href="#" class="battle_attack" data-move="' + k + '">' + move.name + ' <span>' + v.pp + '/' + move.pp + '</span></a>' );
        });
        //bind attack
        $( '.battle_attack', this.container ).bind( 'click', function( ev ) {
            ev.preventDefault();
            battle.attack( $( ev.delegateTarget ).attr( 'data-move' ) );
        });

        //items
        $( '.items ul.items', this.container ).empty();
        for( var i = 0; i < data.player.items.length; i++ ) {
            var item = data.getItem( data.player.items[i] );
            if( !item.battleOnly )
                $( '.items ul.items', this.container ).append( '<li><a href="#" class="use_item" data-item="' + i + '"><strong>' + item.name + '</strong><img src="inc/img/items/' + item.image + '.png" /></a></li>' );
        }
        //bind items
        $( 'ul.items a.use_item', this.container ).bind( 'click', function( ev ) {
            ev.preventDefault();
            battle.useItem( $( ev.delegateTarget ).attr( 'data-item' ) );
        });

        //draw team
        $( '.team', this.container ).empty();
        for( var i = 0; i < this.data.player_team.length; i++ ) {
            if( i == this.data.active_player ) continue;
            var pk = this.data.player_team[i];
            $( '.team', this.container ).append( '<a class="battle_team" data-id="' + i + '" href="#"><img src="inc/img/pokemon/front/' + pk.pokemon_id + '.png" /><strong>' + pk.name + '</strong><span>Level ' + pk.level + '<br />' + pk.hp + '/' + pk.battleStats.hp + 'HP</span></a>' );
        }
        //bind team
        $( '.battle_team', this.container ).bind( 'click', function( ev ) {
            ev.preventDefault();
            battle.swap( $( ev.delegateTarget ).attr( 'data-id' ) );
        });
    },

    //do log
    doLog: function( log ) {
        for( var i = 0; i < log.length; i++ )
            $( '#log', this.container ).prepend( log[i].text + '<br />' );
    },

    //begin a battle
    begin: function( d ) {
        if( battle.disabled ) return;
        if( d.error ) return pkrusset.warning( d.error );
        move.disabled = true;
        map.disabled = true;

        //clear log + add new stuff
        $( '#log', this.container ).empty();
        battle.doLog( d.log );

        battle.data = d;
        battle.draw();
        battle.switchTab( 'attack' );

        //in battle
        data.player.battle = true;

        //show
        battle.container.show();
    },

    //end battle
    end: function( d ) {
        if( d.error ) return pkrusset.warning( d.error );
        //do log
        battle.doLog( d.log );

        //loop our pokemon, where identical overwrite
        for( var i = 0; i < data.player.pokemon.length; i++ )
            for( var j = 0; j < d.length; j++ )
                if( d[j].identical( data.player.pokemon[i] ) )
                    data.player.pokemon[i] = d[j];

        //no longer in battle
        data.player.battle = false;

        //show close button
        $( '#close', battle.container ).show();
        //bind close button
        $( '#close', battle_container ).bind( 'click', function( ev ) {
            ev.preventDefault();
            battle.close();
        });
    },

    //close
    close: function() {
        this.disabled = false;
        move.disabled = false;
        map.disabled = false;

        //close + unbind
        $( '#close', this.container ).hide().unbind( 'click' );
        this.container.hide();

        //reenable the tabs
        this.enable();
    },

    //process incoming data
    process: function( d ) {
        //catch errors
        if( d.error ) {
            battle.enable();
            return pkrusset.warning( d.error );
        }

        //do log
        battle.doLog( d.log );

        //swap out our data
        battle.data = d.battle;
        //redraw
        battle.draw();

        //complete?
        if( d.complete == true ) {
            battle.disabled = true;
            battle.disable();
            setTimeout( function() { network.send( 'battle_end', {}, battle.end ); }, 500 );
        } else {
            battle.enable();
        }
    },

    //attack
    attack: function( move ) {
        if( this.disabled ) return;
        this.disable();

        //send attack
        network.send( 'battle_move', { move: move }, battle.process );
    },

    //swap
    swap: function( id ) {
        if( this.disabled ) return;
        this.disable();

        //send attack
        network.send( 'battle_move', { pokemon_id: id }, battle.process );
    },

    //run
    run: function() {
        network.send( 'battle_end', { running: true }, battle.end );
    },

    //use item
    useItem: function( id ) {
        network.send( 'battle_move', { item_id: id }, battle.process );
    }
}

pkrusset.addStart( battle.start );