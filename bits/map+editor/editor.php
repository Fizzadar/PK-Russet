<!DOCTYPE html>
<html>
<head>
	<!--meta-->
	<title>Map + Editor</title>
	<meta charset="UTF-8" />

	<!--style-->
	<link rel="stylesheet" href="_inc/fonts/bebas-neue/style.css" media="all" />
	<link rel="stylesheet" href="_inc/css/pkrusset.css" media="all" />

	<!--jquery & plugins-->
	<script type="text/javascript" src="_inc/js/lib/jquery.js"></script>

	<!--pkrusset-->
	<script type="text/javascript" src="_inc/js/pkrusset.js"></script>
	<script type="text/javascript" src="_inc/js/keyboard.js"></script>
	<script type="text/javascript" src="_inc/js/map.js"></script>
	<script type="text/javascript" src="_inc/js/move.js"></script>
	<script type="text/javascript" src="_inc/js/data.js"></script>
	<script type="text/javascript" src="_inc/js/loader.js"></script>

	<!--editor addons-->
	<script type="text/javascript" src="_inc/js/editor.js"></script>
	<link rel="stylesheet" href="_inc/css/editor.css" media="all" />

	<!--php - js-->
	<script type="text/javascript">
		//override localStorage on ?new (and remove ?new so accidental reload !fuckupmap)
	<?php if( isset( $_GET['new'] ) ): ?>
		localStorage.removeItem( 'pkrusset_map' );
		window.history.pushState( '', '', window.location.origin + window.location.pathname );
	<?php endif; ?>

		//editor tiles
		<?php
			//setup
			$tiles = array();
			$dirs = glob( '_inc/img/tiles/enlarged/*' );

			//1st level
			foreach( $dirs as $dir ):
				$tiles[basename( $dir )] = array();
				//2nd level
				$subdirs = glob( $dir . '/*' );
				foreach( $subdirs as $subdir ):
					$tiles[basename( $dir )][basename( $subdir )] = array();
					//3rd level (files)
					$files = glob( $subdir . '/*.png' );
					foreach( $files as $file )
						$tiles[basename( $dir )][basename( $subdir )][] = str_replace( '.png', '', basename( $file ) );
				endforeach;
			endforeach;
		?>
		editor.tiles = <?php echo json_encode( $tiles ); ?>;

		//editor blocks
		editor.blocks = {
			nomove: {
				color: 'black'
			},
			door: {
				color: 'blue',
				//data required
				data: [ 'x', 'y', 'map' ]
			},
			uplevel: {
				color: 'orange'
			},
			downlevel: {
				color: 'orange'
			},
			pokemon: {
				color: 'green'
			}
		}


		//player data


		//map data
	</script>
</head>
<body onload="pkrusset.start();">

	<!--loader-->
	<div id="loader">
		<img src="_inc/img/loader.gif" alt="" /><br />Loading...
		<div id="welcome">
			<p>Welcome to PK Russet, here are some basic controls:</p>
			<ul>
				<li><strong>w</strong> or <strong>&uarr;</strong>: move up</li>
				<li><strong>a</strong> or <strong>&larr;</strong>: move left</li>
				<li><strong>s</strong> or <strong>&darr;</strong>: move down</li>
				<li><strong>d</strong> or <strong>&rarr;</strong>: move right</li>
				<li><strong>space</strong>: open battles, dialog</li>
				<li><strong>p</strong>: view pokemon &amp; inventory</li>
				<li><strong>shift</strong>: walking speed</li>

				<li class="info">
					PK Russet is an open source javascript &amp; html powered game <a href="#">Read more &rarr;</a>
				</li>
			</ul>
		</div><!--end welcome-->
	</div>

	<!--header-->
	<div id="header">
		<h1><a href="editor.php">PK Russet <span>/Editor</span></a></h1>
		<ul>
			<li><a href="editor.php?new">New Map</a></li>
			<li><a href="#">Your Maps</a></li>
			<li><a href="#">Browse Maps</a></li>
			<li><a href="#">Community</a></li>
			<li><a href="#">Play &rarr;</a></li>

			<li class="right"><a href="#">Logout</a></li>
			<li class="right"><span>Hola, Fizzadar</span></li>
		</ul>
	</div><!--end header-->

	<!--start page-->
	<div id="page_body">

		<!--map-->
		<div id="map_container">
			<div id="player"><img src="" /></div>
			<div id="overmap"></div>
			<canvas id="map" width="32" height="32"></canvas>
		</div><!--end map_container-->

		<!--editor specific-->
		<img id="edit_preview" src="_inc/img/blank.png" />
		<div id="edit_sidebar">
			<div id="buttons">
				<button id="extend_width">+Width</button>
				<button id="extend_height">+Height</button>
				<button id="test_map">Test Map</button>
				<button id="export">Export</button>
				<button id="undo">Undo</button>
				<button id="redo">Redo</button>
				<button id="down_level">-Level</button>
				<button id="up_level">+Level</button>
			</div><!--end buttons-->
			<div id="modes">
				<button id="tile_mode" class="active">Design: Tiles</button>
				<button id="block_mode">Structure: Blocks</button>
			</div><!--end modes-->
			<div id="folders"></div>
			<div id="tiles"></div><!--end tiles-->
		</div><!--end edit_sidebar-->
		<pre id="edit_export">
		</pre><!--end edit_export-->

	</div><!--end page_body-->

</body>
</html>