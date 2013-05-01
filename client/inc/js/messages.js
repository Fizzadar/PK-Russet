var messages = {
    messages: [],

    //start
    start: function() {
        messages.element = $( '#messages' );

        return true;
    },

    //add message
    addMessage: function( type, text ) {
        var id = this.messages.length;
        this.element.append( '<div class="' + type + '" id="message_' + id + '">' + text + '</div>' );
        //add to messages
        this.messages[id] = $( '#message_' + id, this.element );
        //timeout
        setTimeout( function() { messages.removeMessage( id ) }, 2000 );
    },

    //remove message
    removeMessage: function( id ) {
        //remove it
        $( '#message_' + id, this.element ).fadeOut( 300, function() {
            $( '#message_' + id, messages.element ).remove();
        });
        //false array
        this.messages[id] = false;
    }
}

pkrusset.addStart( messages.start );