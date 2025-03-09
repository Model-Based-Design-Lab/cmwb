<?php
/**
 * Woocommerce support
 *
 * @package Meteorite
 */

if ( ! class_exists( 'WooCommerce' ) ) :
	return;
endif;

/**
 * Declare support
 */
function meteorite_woocommerce_support() {
	add_theme_support( 'woocommerce' );
}
add_action( 'after_setup_theme', 'meteorite_woocommerce_support' );

/**
 * Theme wrappers
 */
function meteorite_woocommerce_actions() {
	remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
	remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
	add_action( 'woocommerce_before_main_content', 'meteorite_wrapper_start', 10 );
	add_action( 'woocommerce_after_main_content', 'meteorite_wrapper_end', 10 );
	remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20, 0 );
	if ( get_theme_mod( 'header_titlebar', 'off' ) == 'on' ) {
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );
	}
	add_action( 'woocommerce_before_single_product_summary', 'meteorite_wrap_wc_image_start', 9 );
	add_action( 'woocommerce_before_single_product_summary', 'meteorite_wrap_wc_image_end', 21 );
}
add_action( 'init', 'meteorite_woocommerce_actions' );

function meteorite_wrapper_start() {
	echo	'<div id="primary" class="content-area col-md-9">';
	echo		'<main id="main" class="site-main" role="main">';
}
function meteorite_wrapper_end() {
	echo		'</main>';
	echo	'</div>';
}
function meteorite_wrap_wc_image_start() {
	echo '<div class="wc-image-wrapper">';
}
function meteorite_wrap_wc_image_end() {
	echo '</div>';
}

/**
 * Number of columns per row
 */
function meteorite_shop_columns() {
	return 3;
}
add_filter( 'loop_shop_columns', 'meteorite_shop_columns' );

/**
 * Number of related products
 */
function meteorite_related_products_args( $args ) {
	$args['posts_per_page'] = 3;
	$args['columns'] = 3;
	return $args;
}
add_filter( 'woocommerce_output_related_products_args', 'meteorite_related_products_args' );

/**
 * Hide page title
 */
add_filter( 'woocommerce_show_page_title', '__return_false' );
