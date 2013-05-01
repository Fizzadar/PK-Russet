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

	<!--php - js-->
	<script type="text/javascript">
		//override localStorage on ?new (and remove ?new so accidental reload !fuckupmap)
	<?php if( isset( $_GET['new'] ) ): ?>
		localStorage.removeItem( 'pkrusset_map' );
		window.history.pushState( '', '', window.location.origin + window.location.pathname );
	<?php endif; ?>


		//when ready
		$( document ).ready( function() {
			setTimeout( function() {
				map.loadFile( 'russet_village', function() {
					move.moveTo( 17, 13 );
					loader.hide();
				});
			}, 500 );
		});
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
		<h1><a href="play.php">PK Russet</a></h1>
		<ul>
			<li class="right"><a href="#">Logout</a></li>
			<li class="right"><span>Hola, Fizzadar</span></li>
		</ul>
	</div><!--end header-->

	<!--start page-->
	<div id="page_body">
		<!--manage-->
		<div id="manage_container">
		</div><!--end manage_container-->

		<!--battle-->
		<div id="battle_container">
		</div><!--end battle_container-->

		<!--map-->
		<div id="map_container">
			<div id="player"><img src="" /></div>
			<div id="overmap"></div>
			<canvas id="map" width="32" height="32"></canvas>
		</div><!--end map_container-->
	</div><!--end page_body-->

</body>
</html>