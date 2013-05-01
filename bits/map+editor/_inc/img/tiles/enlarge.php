<?php
	$tiles = array();

	//get all tiles, make all directories
	foreach( glob( 'source/*' ) as $dir ):
		if( !is_dir( 'enlarged/' . basename( $dir ) ) )
			mkdir( 'enlarged/' . basename( $dir ) );

		if( !is_dir( 'overlay/' . basename( $dir ) ) )
			mkdir( 'overlay/' . basename( $dir ) );

		foreach( glob( $dir . '/*' ) as $subdir ):
			if( !is_dir( 'enlarged/' . basename( $dir ) . '/' . basename( $subdir ) ) )
			mkdir( 'enlarged/' . basename( $dir ) . '/' . basename( $subdir ) );

			if( !is_dir( 'overlay/' . basename( $dir ) . '/' . basename( $subdir ) ) )
			mkdir( 'overlay/' . basename( $dir ) . '/' . basename( $subdir ) );

			foreach( glob( $subdir . '/*.png' ) as $file )
				$tiles[$dir . $subdir . str_replace( '.png', '', basename( $file ) )] = array(
					'file' => $file
				);
		endforeach;
	endforeach;

	//loop tiles
	foreach( $tiles as $key => $tile ):
		//load each tile as image
		$source = imagecreatefrompng( $tile['file'] );

		//old w/h
		$owidth = imagesx( $source );
		$oheight = imagesy( $source );

		//reject if not multiple of 16 x or y
		if( $owidth % 16 != 0 or $oheight % 16 != 0 ):
			echo $key . ' was skipped (x/y not 16px multiple)' . PHP_EOL;
			continue;
		endif;

		//get width/height, x2
		$width = $owidth * 2;
		$height = $oheight * 2;

		//create new image
		$dest = imagecreate( $width, $height );

		//fill transparent white
		$white = imagecolorallocate( $dest, 255, 255, 255 );
		imagecolortransparent( $dest, $white );
		imagefill( $dest, 0, 0, $white );

		//copy image
		imagecopyresized( $dest, $source, 0, 0, 0, 0, $width, $height, $owidth, $oheight );

		//save
		imagepng( $dest, str_replace( 'source/', 'enlarged/', $tile['file'] ) );

		//cleanup

		echo $key . ' was resized' . PHP_EOL;
	endforeach;

	//done
	echo PHP_EOL . 'complete';
?>