<?php
/**
 * The sidebar containing the footer widget area.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Meteorite
 */

// Set widget areas classes based on user choice
$widget_areas = get_theme_mod( 'footer_widget_areas', '3' );
if ( '3' == $widget_areas ) {
	$cols = 'col-md-4';
} elseif ( '4' == $widget_areas ) {
	$cols = 'col-md-3';
} elseif ( '2' == $widget_areas ) {
	$cols = 'col-md-6';
} else {
	$cols = 'col-md-12';
}
?>

<div id="sidebar-footer" class="footer-widgets widget-area" role="complementary">
	<div class="container">
		<div class="row">
		<?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
			<div class="sidebar-column <?php echo $cols; ?>">
				<?php dynamic_sidebar( 'footer-1' ); ?>
			</div>
		<?php endif; ?>	
		<?php if ( is_active_sidebar( 'footer-2' ) ) : ?>
			<div class="sidebar-column <?php echo $cols; ?>">
				<?php dynamic_sidebar( 'footer-2' ); ?>
			</div>
		<?php endif; ?>	
		<?php if ( is_active_sidebar( 'footer-3' ) ) : ?>
			<div class="sidebar-column <?php echo $cols; ?>">
				<?php dynamic_sidebar( 'footer-3' ); ?>
			</div>
		<?php endif; ?>	
		<?php if ( is_active_sidebar( 'footer-4' ) ) : ?>
			<div class="sidebar-column <?php echo $cols; ?>">
				<?php dynamic_sidebar( 'footer-4' ); ?>
			</div>
		<?php endif; ?>	
		</div>
	</div>	
</div>