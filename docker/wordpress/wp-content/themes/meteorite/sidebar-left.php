<?php
/**
 * The sidebar containing the secondary widget area.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Meteorite
 */

if ( ! is_active_sidebar( 'sidebar-left' ) ) {
	return;
}
?>

<aside id="tertiary" class="widget-area col-md-3 sidebar sidebar-left" role="complementary">
	<?php dynamic_sidebar( 'sidebar-left' ); ?>
</aside>
