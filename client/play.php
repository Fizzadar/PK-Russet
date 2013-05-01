<?php require( 'header.php' ); ?>

    <!--start page-->
    <div id="page_body">
        <!--menu-->
        <div id="menu">
            Menu
            <ul>
                <li><a href="#" class="pkrusset_manage">Manage Team</a></li>
                <li><a href="#" class="pkrusset_save">Save Game</a></li>
                <li><a href="#" class="pkrusset_new">New Game</a></li>
                <li><a href="#" class="pkrusset_connect">Connect to Server</a></li>
                <li><a href="#" class="pkrusset_help">Help &amp; Controls</a></li>
            </ul>
        </div><!--end menu-->

        <!--manage-->
        <div id="manage_container"><div class="wrap">
            <div class="pokemon">
                <img class="pokemon" src="inc/img/pokemon/front/0.png" />
                <ul class="tabs">
                    <li data-tab="stats" class="active"><a href="#">Stats</a></li>
                    <li data-tab="moves"><a href="#">Moves</a></li>
                    <li data-tab="evolution"><a href="#">Evolution</a></li>
                    <li data-tab="items"><a href="#">Items</a></li>
                </ul>
                <div class="tab stats">
                    <table class="stats" cellspacing="0" cellpadding="0">
                        <thead><tr>
                            <th>Stat</th>
                            <th>Value</th>
                        </tr></thead>
                        <tbody>
                            <tr>
                                <td>Defense</td>
                                <td>32</td>
                            </tr>
                            <tr>
                                <td>Defense</td>
                                <td>32</td>
                            </tr>
                        </tbody>
                    </table>
                </div><!--end tab-->
                <div class="tab moves">
                    <ul class="newmoves"></ul>
                    <ul class="moves"></ul>
                </div><!--end tab-->
                <div class="tab evolution">
                    <img src="inc/img/pokemon/front/0.png" />
                    <div></div>
                </div><!--end tab-->
                <div class="tab items">
                    <ul class="items">
                        <li><a href="#"><strong>Item Name</strong><img src="inc/img/items/potion.png" /></a></li>
                        <li><a href="#"><strong>Item Name</strong><img src="inc/img/items/potion.png" /></a></li>
                        <li><a href="#"><strong>Item Name</strong><img src="inc/img/items/potion.png" /></a></li>
                        <li><a href="#"><strong>Item Name</strong><img src="inc/img/items/potion.png" /></a></li>
                    </ul>
                </div><!--end tab-->
            </div><!--end pokemon-->

            <table class="pokemon" cellspacing="0" cellpadding="0">
                <thead><tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Types</th>
                    <th>Health</th>
                    <th>Level</th>
                    <th>Experience</th>
                    <th></th>
                </tr></thead>
                <tbody>
                </tbody>
            </table>
        </div></div><!--end manage_container-->

        <!--battle-->
        <div id="battle_container" class="grass">
            <div class="pokemon"><div class="wrap">
                <div id="mine" class="pokemon">
                    <div class="hp"><div style="width:0%;">0/0</div></div>
                    <img src="inc/img/pokemon/front/0.png" />
                </div><!--end player pokemon-->

                <div id="enemy" class="pokemon">
                    <img src="inc/img/pokemon/front/0.png" />
                    <div class="hp"><div style="width:0%;">0/0</div></div>
                </div><!--end enemy pokemon-->
            </div></div><!--end pokemon-->

            <a id="close" class="battle_close" href="#">End Battle</a>

            <div id="log"></div><!--end log-->

            <div id="control"><div class="wrap">
                <ul class="tabs">
                    <li class="active" data-tab="attack"><a href="#">Attack</a></li>
                    <li data-tab="team"><a href="#">Team</a></li>
                    <li data-tab="items"><a href="#">Items</a></li>
                    <li><a href="#" class="battle_run">Run</a></li>
                </ul>

                <div class="tab attack"></div>
                <div class="tab team"></div>
                <div class="tab items"></div><!--end tabs-->
            </div></div><!--end control-->
        </div><!--end battle_container-->

        <!--map-->
        <div id="map_container">
            <div id="player">
                <div class="chat"><input type="text" class="pkrusset_chat_input" /><span class="pkrusset_chat">this is some chat</span></div>
                <img src="" />
            </div>
            <div id="players"></div>
            <div id="overmap"></div>
            <canvas id="map" width="32" height="32"></canvas>
        </div><!--end map_container-->
    </div><!--end page_body-->

</body>
</html>