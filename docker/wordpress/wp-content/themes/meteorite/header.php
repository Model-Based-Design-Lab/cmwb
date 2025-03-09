<?php
/**
 * Displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Meteorite
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>

	<?php
	/**
	 * Hooked: meteorite_preloader(), 7
	 * Hooked: meteorite_fullscreen_search(), 8
	 */
	do_action( 'meteorite_before_site' );
	?>

	<div id="page" class="site <?php meteorite_has_header(); ?>">
		<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'meteorite' ); ?></a>

		<?php
		// Order of the navigation, hero area (header image) and titlebar based on menu position
		$menu_position = get_theme_mod( 'menu_pos', 'above' );
		if ( 'above' == $menu_position ) {
			meteorite_nav();
			meteorite_header_hero_area();
			meteorite_header_titlebar();
		} elseif ( 'above_solid' == $menu_position ) {
			meteorite_nav();
			meteorite_header_hero_area();
			meteorite_header_titlebar();
		} else {
			meteorite_header_hero_area();
			meteorite_nav();
			meteorite_header_titlebar();
		}
		?>

		<div id="content" class="site-content">
			<div class="container content-wrapper">
				<div class="row">
