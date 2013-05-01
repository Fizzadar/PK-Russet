<?php
	$db = mysql_connect( 'localhost', 'root', 'root' ) or die( 'no mysql' );
	mysql_select_db( 'pkrusset_new' ) or die( 'no db' );

	function query( $sql ) {
		$res = mysql_query( $sql );
		if( !$res )
			die( mysql_error() );

		$data = [];
		while( $d = mysql_fetch_assoc( $res ) ):
			$data[] = $d;
		endwhile;

		return $data;
	}
	//stats
	$data = query( 'SELECT id, identifier FROM game_stats' );
	$stats = [];
	foreach( $data as $k => $v )
		$stats[$v['id']] = $v['identifier'];

	//types
	$data = query( 'SELECT id, identifier FROM game_types' );
	$types = [];
	foreach( $data as $k => $v )
		$types[$v['id']] = $v['identifier'];


	//save to file
	//file_put_contents( '_inc/data/types.json', json_encode( $types ) );
	//file_put_contents( '_inc/data/stats.json', json_encode( $stats ) );

	/*
	//experience
	$exp = [];
	$experience = query( 'SELECT * FROM game_experience' );
	foreach( $experience as $e ):
		if( !isset( $exp[$e['growth_rate_id']] ) )
			$exp[$e['growth_rate_id']] = [];

		$exp[$e['growth_rate_id']][$e['level']] = $e['experience'];
	endforeach;
	//file_put_contents( '_inc/data/experience.json', json_encode( $exp ) );
	*/


	//moves
if( isset( $_GET['moves'] ) ):
	$moves = query( 'SELECT * FROM game_moves' );
	foreach( $moves as $k => $v ):
		//stat effectors
		$sta = query( 'SELECT stat_id, `change` FROM game_move_stats WHERE move_id = ' . $v['id'] );
		$v['stat_effects'] = [];
		foreach( $sta as $stat )
			$v['stat_effects'][$stats[$stat['stat_id']]] = (int) $stat['change'];

		//meta
		$meta = query( 'SELECT min_hits, max_hits, min_turns, max_turns, healing, crit_rate, ailment_chance, flinch_chance, stat_chance FROM game_move_meta WHERE move_id = ' . $v['id'] );
		if( count( $meta ) > 0 )
			foreach( $meta[0] as $c => $d )
				$v[$c] = (int) $d;

		//change to int
		$v['effect_chance'] = (int) $v['effect_chance'];
		$v['effect_id'] = (int) $v['effect_id'];
		$v['damage_class_id'] = (int) $v['damage_class_id'];
		$v['target_id'] = (int) $v['target_id'];
		$v['accuracy'] = (int) $v['accuracy'];
		$v['pp'] = (int) $v['pp'];
		$v['power'] = (int) $v['power'];

		//remove bits
		$id = $v['id'];
		unset( $v['id'] );

		$string = json_encode( $v );
		if( $string )
			file_put_contents( '_inc/data/moves/' . $id . '.json', $string );
	endforeach;
	echo 'moves done<br />';
endif;



	//pokemon
if( isset( $_GET['pokemon'] )):
	$pokemon = query( 'SELECT * FROM game_pokemon' );
	foreach( $pokemon as $k => $v ):
		//get moves
		$moves = query( 'SELECT move_id, level FROM game_pokemon_moves WHERE pokemon_id = ' . $v['id'] );
		$v['moves'] = [];
		foreach( $moves as $move )
			$v['moves'][$move['move_id']] = (int) $move['level'];

		//get types
		$types = query( 'SELECT type_id FROM game_pokemon_types WHERE pokemon_id = ' . $v['id'] );
		$v['types'] = [];
		foreach( $types as $type )
			$v['types'][] = (int) $type['type_id'];

		//get stats
		$sta = query( 'SELECT stat_id, base_stat FROM game_pokemon_stats WHERE pokemon_id = ' . $v['id'] );
		$v['stats'] = [];
		foreach( $sta as $stat )
			$v['stats'][$stats[$stat['stat_id']]] = (int) $stat['base_stat'];

		//get evolution chane
		$chain = query( 'SELECT game_evolution.growth_rate_id FROM game_evolution, game_pokemon WHERE game_evolution.evolution_chain_id = game_pokemon.evolution_chain_id AND game_pokemon.id = ' . $v['id'] );
		$v['growth_rate'] = (int) $chain[0]['growth_rate_id'];

		//get evolve to pokemon
		$evolve = query( 'SELECT game_pokemon.id, game_pokemon_evolution.minimum_level FROM game_pokemon, game_pokemon_evolution WHERE game_pokemon.evolves_from_pokemon_id = ' . $v['id'] . ' AND game_pokemon_evolution.evolved_pokemon_id = game_pokemon.id' );
		if( count( $evolve ) > 0 )
			$v['evolves_to'] = [ 'id' => (int) $evolve[0]['id'], 'level' => (int) $evolve[0]['minimum_level'] ];

		//int bits
		$v['height'] = (int) $v['height'];
		$v['gender_rate'] = (int) $v['gender_rate'];
		$v['capture_rate'] = (int) $v['capture_rate'];
		$v['base_experience'] = (int) $v['base_experience'];

		//remove bits
		unset( $v['evolution_chain_id'] );
		unset( $v['evolves_from_pokemon_id'] );
		$id = $v['id'];
		unset( $v['id'] );

		$string = json_encode( $v );
		if( $string )
			file_put_contents( '_inc/data/pokemon/' . $id . '.json', $string );

	endforeach;
	echo 'pokemon done';
endif;

?>