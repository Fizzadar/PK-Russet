<?php require( 'header.php' ); ?>

    <!--editor addons-->
    <script type="text/javascript" src="inc/js/editor.js"></script>
    <link rel="stylesheet" href="inc/css/editor.css" media="all" />
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
            $dirs = glob( 'inc/img/tiles/enlarged/*' );

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
    </script>

    <!--start page-->
    <div id="page_body">
        <!--map-->
        <div id="map_container">
            <div id="player"><img src="" /></div>
            <div id="overmap"></div>
            <canvas id="map" width="32" height="32"></canvas>
        </div><!--end map_container-->

        <!--editor specific-->
        <img id="edit_preview" src="inc/img/blank.png" />
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
        <textarea id="edit_export">
        </textarea><!--end edit_export-->

    </div><!--end page_body-->

</body>
</html>