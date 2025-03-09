<?php

/**
 * Gutenberg support
 */

function meteorite_gutenberg_styles() {
	wp_enqueue_style( 'meteorite-block-editor-styles', get_theme_file_uri( '/meteorite-gutenberg-editor-styles.css' ), '', '1.0', 'all' );

	wp_enqueue_style( 'meteorite-fonts', esc_url( meteorite_google_fonts() ), array(), null );


	// Dynamic styles
	$custom = '';

	// Fonts
	if ( get_theme_mod( 'disable_google_fonts', false ) == false ) :

		$headings_fonts = get_theme_mod( 'headings_font_family' );
		$body_fonts 	= get_theme_mod( 'body_font_family' );

		if ( '' != $headings_fonts ) {
			$custom .= ".editor-post-title__block .editor-post-title__input, .editor-block-list__layout .editor-post-title__input, .editor-block-list__layout h1, .editor-block-list__layout h2, .editor-block-list__layout h3, .editor-block-list__layout h4, .editor-block-list__layout h5, .editor-block-list__layout h6 { font-family:" . $headings_fonts . ";}"."\n";
		}

		if ( '' != $body_fonts ) {
			$custom .= ".editor-block-list__layout, .editor-block-list__layout .editor-block-list__block { font-family:" . $body_fonts . ";}"."\n";
		}

	endif;
	
	
	// H1 size
	$h1_size = get_theme_mod( 'h1_size', '44' );
	if ( $h1_size ) {
		$custom .= ".editor-block-list__layout h1 { font-size:" . intval( $h1_size ) . "px; }"."\n";
	}
	// H2 size
	$h2_size = get_theme_mod( 'h2_size', '38' );
	if ( $h2_size ) {
		$custom .= ".editor-block-list__layout h2 { font-size:" . intval( $h2_size ) . "px; }"."\n";
	}
	// H3 size
	$h3_size = get_theme_mod( 'h3_size', '32' );
	if ( $h3_size ) {
		$custom .= ".editor-block-list__layout h3 { font-size:" . intval( $h3_size ) . "px; }"."\n";
	}
	// H4 size
	$h4_size = get_theme_mod( 'h4_size', '28' );
	if ( $h4_size ) {
		$custom .= ".editor-block-list__layout h4 { font-size:" . intval( $h4_size ) . "px; }"."\n";
	}
	// H5 size
	$h5_size = get_theme_mod( 'h5_size', '22' );
	if ( $h5_size ) {
		$custom .= ".editor-block-list__layout h5 { font-size:" . intval( $h5_size ) . "px; }"."\n";
	}
	// H6 size
	$h6_size = get_theme_mod( 'h6_size', '18' );
	if ( $h6_size ) {
		$custom .= ".editor-block-list__layout h6 { font-size:" . intval( $h6_size ) . "px; }"."\n";
	}
	// Body size
	$body_size = get_theme_mod( 'body_size', '16' );
	if ($body_size) {
		$custom .= ".editor-block-list__block, .editor-block-list__block p { font-size:" . intval( $body_size ) . "px; }"."\n";
	}


	$apply_editor_bg_text = apply_filters( 'meteorite_apply_editor_bg_text', true );

	if ( true === $apply_editor_bg_text ) {
		// __COLORS
		// Body
		$body_text = get_theme_mod( 'body_text_color', '#777777' );
		$custom .= ".editor-block-list__layout, .editor-block-list__layout .editor-block-list__block { color:" . esc_attr( $body_text ) . "}"."\n";
		
		// Body background
		$body_background = get_background_color();
		$custom .= ".editor-block-list__layout, .editor-block-list__layout .editor-block-list__block { background-color: #" . esc_attr( $body_background ) . "}"."\n";
	}

	// Output all the styles
	wp_add_inline_style( 'meteorite-block-editor-styles', $custom );	

}
add_action( 'enqueue_block_editor_assets', 'meteorite_gutenberg_styles' );