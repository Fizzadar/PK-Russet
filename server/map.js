var map = {
    socket: false,
    clients: {},
    keyToMap: {},

    start: function( socket ) {
        this.data = module.parent.exports.data;
        this.randomstring = module.parent.exports.randomstring;

        this.socket = socket.of( '/map' );

        //bind client connections & commands
        this.socket.on( 'connection', function( client ) {
            client.on( 'set_map', map.setMap );
        });

        return this;
    },

    //set initial map
    setMap: function( data ) {
        //already done/got a key?
        if( this.mapKey ) return;
        //check map exists
        if( !data.map || !map.data.loadMap( data.map ) ) return;
        if( !map.clients[data.map] ) map.clients[data.map] = [];

        //assign image
        if( !data.image ) data.image = 0;
        this.image = data.image;

        //confirm
        this.emit( 'set_map_confirm', {} );

        //assign a random string to this client to identify them
        this.mapKey = map.randomstring.generate( 8 );

        //notify the clients before adding this one, also send joiner current clients
        var clients = map.clients[data.map];
        for( var i = 0; i < clients.length; i++ ) {
            clients[i].emit( 'client_join', { key: this.mapKey, image: this.image } );
            this.emit( 'client_join', { key: clients[i].mapKey, image: clients[i].image } );
        }

        //add client to map
        map.clients[data.map].push( this );
        map.keyToMap[this.mapKey] = data.map;

        //bind
        this.on( 'set_position', map.setPosition );
        this.on( 'change_map', map.changeMap );
        this.on( 'send_chat', map.sendChat );
    },

    //change map
    changeMap: function( data ) {
        //check map exists
        if( !data.map || !map.data.loadMap( data.map ) ) return;
        if( !map.clients[data.map] ) map.clients[data.map] = [];

        //remove from old map
        var oldmap = map.keyToMap[this.mapKey];
        for( var i = 0; i < map.clients[oldmap].length; i++ ) {
            if( map.clients[oldmap][i].mapKey == this.mapKey ) {
                //remove
                map.clients[oldmap].splice( i, 1 );
                i--;
            } else {
                //notify
                map.clients[oldmap][i].emit( 'client_exit', { key: this.mapKey } );
            }
        }

        //notify the clients before adding this one, also send joiner current clients
        var clients = map.clients[data.map];
        for( var i = 0; i < clients.length; i++ ) {
            clients[i].emit( 'client_join', { key: this.mapKey, image: this.image } );
            this.emit( 'client_join', { key: clients[i].mapKey, image: clients[i].image } );
        }

        //update keytomap
        map.keyToMap[this.mapKey] = data.map;
        //add to new map
        map.clients[data.map].push( this );

        //send back
        this.emit( 'change_map_confirm' );
    },

    //set position
    setPosition: function( data ) {
        //invalid?
        if( !data.x || !data.y || !this.mapKey ) return;

        //get clients
        var clients = map.clients[map.keyToMap[this.mapKey]];

        for( var i = 0; i < clients.length; i++ )
            if( clients[i].mapKey != this.mapKey )
                clients[i].volatile.emit( 'position_data', { key: this.mapKey, xpos: data.x, ypos: data.y } );
    },

    //chat
    sendChat: function( data ) {
        if( !this.mapKey || !data.text ) return;

        //get clients
        var clients = map.clients[map.keyToMap[this.mapKey]];

        for( var i = 0; i < clients.length; i++ )
            if( clients[i].mapKey != this.mapKey )
                clients[i].emit( 'receive_chat', { key: this.mapKey, text: data.text } );
    }
}

module.exports = map;