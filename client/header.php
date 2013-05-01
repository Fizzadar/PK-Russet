<!DOCTYPE html>
<html>
<head>
    <!--meta-->
    <title>PK Russet</title>
    <meta charset="UTF-8" />

    <!--style-->
    <link rel="stylesheet" href="inc/fonts/bebas-neue/style.css" media="all" />
    <link rel="stylesheet" href="inc/css/pkrusset.css" media="all" />

    <!--jquery & plugins-->
    <script type="text/javascript" src="inc/js/lib/jquery.js"></script>
    <script type="text/javascript" src="inc/js/lib/socket.io.js"></script>

    <!--pkrusset client files-->
    <script type="text/javascript" src="inc/js/pkrusset.js"></script>
    <script type="text/javascript" src="inc/js/keyboard.js"></script>
    <script type="text/javascript" src="inc/js/player.js"></script>
    <script type="text/javascript" src="inc/js/map.js"></script>
    <script type="text/javascript" src="inc/js/move.js"></script>
    <script type="text/javascript" src="inc/js/data.js"></script>
    <script type="text/javascript" src="inc/js/loader.js"></script>
    <script type="text/javascript" src="inc/js/network.js"></script>
    <script type="text/javascript" src="inc/js/network.map.js"></script>
    <script type="text/javascript" src="inc/js/server.js"></script>
    <script type="text/javascript" src="inc/js/manage.js"></script>
    <script type="text/javascript" src="inc/js/battle.js"></script>
    <script type="text/javascript" src="inc/js/character.js"></script>

    <!--pkrusset shared files-->
    <script type="text/javascript" src="inc/js/shared/calculation.js"></script>
    <script type="text/javascript" src="inc/js/shared/pokemon.js"></script>
    <script type="text/javascript" src="inc/js/shared/new.js"></script>
    <script type="text/javascript" src="inc/js/shared/battle.js"></script>
</head>
<body onload="pkrusset.start();">

    <!--loader-->
    <div id="loader">
        <img src="inc/img/loader.gif" alt="" /><br />Loading...
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
        <h1><a href="./">PK Russet</a></h1>
        <ul>
            <li><a href="./">Play</a></li>
            <li><a href="./edit">Editor</a></li>
            <!--<li class="right"><a href="#">Logout</a></li>
            <li class="right"><span>Hola, Fizzadar</span></li>-->
        </ul>
    </div><!--end header-->