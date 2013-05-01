<!DOCTYPE html>
<html>
<head>
	<!--meta-->
	<title>canvas testing</title>
	<meta charset="UTF-8" />
	
	<!--style-->
	<style type="text/css">
		body  {
			margin: 0;
			//overflow: hidden;
		}

		.hidden {
			display: none;
		}

		div#map_container {
			position: absolute;
			top: 0;
			left: 0;
			background: #FFF;
		}
		canvas#map {
			background: url( '_inc/img/map_bg.png' ) top left;
			margin-right: 381px;
		}
		img#mouse_preview {
			position: absolute;
			z-index: 98;
			top: 0;
			left: 0;
			opacity: 0.6;
			display: none;
		}

		div#sidebar {
			position: fixed;
			right: 0;
			width: 380px;
			background: #F7F7F7;
			border-left: 1px solid #D7D7D7;
			height: 100%;
			top: 0;
			z-index: 99;
			overflow-x: auto;
		}
	</style>
	
	<!--php - js-->
	<script type="text/javascript">
		<?php
			//setup
			$tiles = array();
			$dirs = glob( '_inc/tiles/enlarged/*' );

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
		var tiles = <?php echo json_encode( $tiles ); ?>;
	</script>

	<!--scripts-->
	<script type="text/javascript">
		window.onload = function() {
			//vars
			var pos_x = 0;
			var pos_y = 0;
			var map_el = document.getElementById( 'map' );
			var mouse_preview = document.getElementById( 'mouse_preview' );
			var sidebar = document.getElementById( 'sidebar' );
			var map;

			//set width & height
			map_el.width = 32 * 80;
			map_el.height = 32 * 40;

			//ok?
			if( map_el.getContext ) {
				map = map_el.getContext( '2d' );

				var img1 = document.getElementById( 'tile:buildings/houses/smallhouse_2' );
				//map.drawImage( img1, 15, 15, 94, 144 );
				//map.clearRect( 0, 0, map_el.width, map_el.height );
				map.drawImage( img1, 32, 32 + 0, img1.width, img1.height );
			}

			//init vars
			var mouse_preview_x = 0;
			var mouse_preview_y = 0;

			//mousemove
			window.onmousemove = function() {
				/* from: http://www.quirksmode.org/js/events_properties.html */
				var posx = 0;
				var posy = 0;
				if (!e) var e = window.event;
				if (e.pageX || e.pageY) 	{
					posx = e.pageX;
					posy = e.pageY;
				}
				else if (e.clientX || e.clientY) 	{
					posx = e.clientX + document.body.scrollLeft
						+ document.documentElement.scrollLeft;
					posy = e.clientY + document.body.scrollTop
						+ document.documentElement.scrollTop;
				}
				
				//work out position blocks
				pos_x = Math.floor( posx / 32 );
				pos_y = Math.floor( posy / 32 );

				//move preview to this block
				mouse_preview.style.left = pos_x * 32 + 'px';
				mouse_preview.style.top = pos_y * 32 + 'px';
			}

			//stop/start overflow w/ sidebar
			sidebar.onmouseover = function() {
				document.body.style.overflow = 'hidden';
			}
			sidebar.onmouseout = function() {
				document.body.style.overflow = 'auto';
			}

			//show/hide preview
			document.body.onmouseover = function() {
				mouse_preview.style.display = 'block';
			}
			document.body.onmouseout = function() {
				mouse_preview.style.display = 'none';
			}

			//click on map
			mouse_preview.onclick = function() {
				var img1 = document.getElementById( 'tile:buildings/houses/smallhouse_1' );
				map.drawImage( img1, pos_x * 32, pos_y * 32, img1.width, img1.height );
			}
		}
	</script>
</head>
<body>
	<div id="map_container">
		<canvas id="map" width="10"></canvas>

		<!--editor specific-->
		<img src="_inc/tiles/enlarged/buildings/houses/smallhouse_1.png" id="mouse_preview" />
	</div><!--end map_container-->

	<div id="sidebar">
		<?php foreach( $tiles as $dir => $dirs ): echo '<h1>' . $dir . '</h1>'; foreach( $dirs as $subdir => $subdirs ): echo '<h2>' . $subdir . '</h2>'; foreach( $subdirs as $file ): ?>
			<img src="_inc/tiles/enlarged/<?php echo $dir . '/' . $subdir . '/' . $file; ?>.png" id="tile:<?php echo $dir . '/' . $subdir . '/' . $file; ?>" />
		<?php endforeach; endforeach; endforeach; ?>
	</div><!--end sidebar-->

	<!--preload all tiles-->
	<div class="hidden">
	<?php foreach( $tiles as $dir => $dirs ): foreach( $dirs as $subdir => $subdirs ): foreach( $subdirs as $file ): ?>
		<img src="_inc/tiles/enlarged/<?php echo $dir . '/' . $subdir . '/' . $file; ?>.png" id="tile:<?php echo $dir . '/' . $subdir . '/' . $file; ?>" />
	<?php endforeach; endforeach; endforeach; ?>
	</div><!--end hidden-->
</body>
</html>