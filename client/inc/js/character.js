function character( object, element ) {
    this.animate = character.animate;
    this.object = object;
    this.element = element;
}

character.animate = function( direction ) {
    var curTime = new Date().getTime();

    //anim time?
    if( curTime < this.object.animTimer && this.object.curDirection == direction )
        return;

    //clear timeout
    clearTimeout( this.animStep1 );
    clearTimeout( this.animStep2 );
    clearTimeout( this.animStep3 );

    //animate!
    switch( direction ) {
        case 'up':
            this.animStep1 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/8.png' );", this.object.animInterval / 3 );
            this.animStep2 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/9.png' );", this.object.animInterval / 3 * 2 );
            this.animStep1 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/1.png' );", this.object.animInterval );
            break;

        case 'down':
            this.animStep1 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/11.png' );", this.object.animInterval / 3 );
            this.animStep2 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/12.png' );", this.object.animInterval / 3 * 2 );
            this.animStep1 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/10.png' );", this.object.animInterval );
            break;

        case 'left':
            this.animStep1 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/2.png' );", this.object.animInterval / 3 );
            this.animStep2 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/4.png' );", this.object.animInterval / 3 * 2 );
            this.animStep1 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/3.png' );", this.object.animInterval );
            break;

        case 'right':
            this.animStep1 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/6.png' );", this.object.animInterval / 3 );
            this.animStep2 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/7.png' );", this.object.animInterval / 3 * 2 );
            this.animStep1 = setTimeout( this.element + ".attr( 'src', 'inc/img/players/' + data.player.image + '/5.png' );", this.object.animInterval );
            break;
    }

    //up anim time
    this.object.animTimer = curTime + this.object.animInterval;
}
