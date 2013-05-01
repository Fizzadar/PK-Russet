/*
    file: js/server.js
    desc: browser-based server for single player
*/

var server = {
    commands: {},

    //run a command
    command: function( command, d ) {
        if( !this.commands[command] ) return pkrusset.error( 'Invalid server command: ' + command );

        //run the function
        this.commands[command]( data.player, d );
    },

    //complete a command
    completeCommand: function( command, data ) {
        network.receive( command, data );
    },

    //add command
    addCommand: function( name, func ) {
        this.commands[name] = func;
    }
}