<?php
/**
 * Outputs the customizer styles
 *
 * @package Meteorite
 */

// Converts hex colors to rgba for different things
function meteorite_hex2rgba( $color, $opacity = 0 ) {
	if ( '#' == $color[0] ) {
		$color = substr( $color, 1 );
	}
	$hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
	$rgb = array_map( 'hexdec', $hex );
	//$opacity = 0.5;
	$output = 'rgba(' . implode( ",", $rgb ) . ',' . $opacity . ')';

	return $output;
}

// Dynamic styles
function meteorite_custom_styles( $custom ) {

	// Variables
	$has_custom_logo 					= has_custom_logo();
	$logo_light 						= get_theme_mod( 'logo_light', '' );
	$logo_before_scroll 				= get_theme_mod( 'logo_before_scroll', 'logo-default' );
	$logo_after_scroll 					= get_theme_mod( 'logo_after_scroll', 'logo-default' );
	$logo_type_mobile 					= get_theme_mod( 'logo_type_mobile', 'logo-default' );
	$body_layout						= get_theme_mod( 'body_layout', 'wide' );
	$body_image_boxed					= get_theme_mod( 'body_image_boxed', '' );
	$body_boxed_image_type 				= get_theme_mod( 'body_boxed_image_type', 'image' );
	$animation_disable_checkbox			= get_theme_mod( 'animation_disable_checkbox', false );
	$hide_meta_single 					= get_theme_mod( 'hide_meta_single', false );
	$hide_meta_single_projects 			= get_theme_mod( 'hide_meta_single_projects', true );
	$page_wrapper_padding_top 			= get_theme_mod( 'page_wrapper_padding_top', '100' );
	$page_wrapper_padding_bottom 		= get_theme_mod( 'page_wrapper_padding_bottom', '100' );
	$header_image_full_height_front 	= get_theme_mod( 'header_image_full_height_front', false );
	$header_height_home 				= get_theme_mod( 'header_height_home', '800' );
	$header_image_full_height_page 		= get_theme_mod( 'header_image_full_height_page', false );
	$header_height_page 				= get_theme_mod( 'header_height_page', '800' );
	$headerimage_overlay_checkbox_front	= get_theme_mod( 'headerimage_overlay_checkbox_front', false );
	$header_image_responsive 			= get_theme_mod( 'header_image_responsive', false );
	$headerimage_overlay_checkbox_sub	= get_theme_mod( 'headerimage_overlay_checkbox_sub', false );
	$headertext_opacity_checkbox 		= get_theme_mod( 'headertext_opacity_checkbox', false );
	$headerimage_bg_fixed_checkbox 		= get_theme_mod( 'headerimage_bg_fixed_checkbox', false );
	$sticky_menu	 					= get_theme_mod( 'sticky_menu', 'sticky' );
	$menu_position 						= get_theme_mod( 'menu_pos', 'above' );
	$menu_style 						= get_theme_mod( 'menu_style', 'inline' );
	$menu_width 						= get_theme_mod( 'menu_width', 'boxed' );
	$menu_float							= get_theme_mod( 'menu_float', true );
	$disable_google_fonts 				= get_theme_mod( 'disable_google_fonts', false );
	$headings_fonts 					= get_theme_mod( 'headings_font_family', '\'Libre Franklin\', sans-serif' );
	$body_fonts 						= get_theme_mod( 'body_font_family', '\'Source Sans Pro\', sans-serif' );
	$site_title_size 					= get_theme_mod( 'site_title_size', '32' );
	$site_desc_size 					= get_theme_mod( 'site_desc_size', '14' );
	$menu_size 							= get_theme_mod( 'menu_size', '14' );
	$h1_size 							= get_theme_mod( 'h1_size', '44' );
	$h2_size 							= get_theme_mod( 'h2_size', '38' );
	$h3_size 							= get_theme_mod( 'h3_size', '32' );
	$h4_size 							= get_theme_mod( 'h4_size', '28' );
	$h5_size 							= get_theme_mod( 'h5_size', '22' );
	$h6_size 							= get_theme_mod( 'h6_size', '18' );
	$body_size 							= get_theme_mod( 'body_size', '16' );
	$body_text_color 					= get_theme_mod( 'body_text_color', '#777777' );
	$primary_color 						= get_theme_mod( 'primary_color', '#337ab7' );
	$site_title_color 					= get_theme_mod( 'site_title_color', '#ffffff' );
	$site_desc_color 					= get_theme_mod( 'site_desc_color', '#ffffff' );
	$site_title_color_sticky 			= get_theme_mod( 'site_title_color_sticky', '#ffffff' );
	$site_desc_color_sticky 			= get_theme_mod( 'site_desc_color_sticky', '#ffffff' );
	$topbar_bg_color 					= get_theme_mod( 'topbar_bg_color', '#202529' );
	$topbar_color 						= get_theme_mod( 'topbar_color', '#ffffff' );
	$topbar_border_color 				= get_theme_mod( 'topbar_border_color', '#ffffff' );
	$menu_bg_color 						= get_theme_mod( 'menu_bg_color', '#202529' );
	$menu_bg_sticky_color 				= get_theme_mod( 'menu_bg_sticky_color', '#202529' );
	$mobile_menu_bg_color 				= get_theme_mod( 'mobile_menu_bg_color', '#202529' );
	$top_items_color 					= get_theme_mod( 'top_items_color', '#ffffff' );
	$top_items_sticky_color 			= get_theme_mod( 'top_items_sticky_color', '#ffffff' );
	$submenu_items_color 				= get_theme_mod( 'submenu_items_color', '#ffffff' );
	$submenu_background 				= get_theme_mod( 'submenu_background', '#202529' );
	$mobile_menu_items_color 			= get_theme_mod( 'mobile_menu_items_color', '#ffffff' );
	$header_image_text_color 			= get_theme_mod( 'header_image_text_color', '#ffffff' );
	$header_overlay_color				= get_theme_mod( 'header_overlay_color', '#000000' );
	$footer_bg_image					= get_theme_mod( 'footer_bg_image', '' );
	$footer_text_center					= get_theme_mod( 'footer_text_center', false );
	$header_titlebar_background 		= get_theme_mod( 'header_titlebar_background', '#337ab7' );
	$header_titlebar_color 				= get_theme_mod( 'header_titlebar_color', '#ffffff' );
	$footer_widgets_background 			= get_theme_mod( 'footer_widgets_background', '#202529' );
	$footer_widgets_color 				= get_theme_mod( 'footer_widgets_color', '#a3aaaa' );
	$footer_background 					= get_theme_mod( 'footer_background', '#1b2024' );
	$footer_color 						= get_theme_mod( 'footer_color', '#a3aaaa' );
	$shop_full_width 					= get_theme_mod( 'shop_full_width', false );

	$custom = '';

	// __Site branding
	if ( true == $has_custom_logo || '' != $logo_light ) {
		if ( 'logo-default' == $logo_before_scroll ) {
			$custom .= ".site-logo.light { display: none; }"."\n";
		} elseif ( 'logo-light' == $logo_before_scroll ) {
			$custom .= ".custom-logo { display: none; }"."\n";
		}
		if ( 'logo-default' == $logo_after_scroll ) {
			$custom .= "@media only screen and (min-width: 992px) { .nav-container.fixed .site-logo.light { display: none; } }"."\n";
			$custom .= "@media only screen and (min-width: 992px) { .nav-container.fixed .custom-logo { display: inline-block; } }"."\n";
		} elseif ( 'logo-light' == $logo_after_scroll ) {
			$custom .= "@media only screen and (min-width: 992px) { .nav-container.fixed .site-logo.light { display: inline-block; } }"."\n";
			$custom .= "@media only screen and (min-width: 992px) { .nav-container.fixed .custom-logo { display: none; } }"."\n";
		}
		if ( 'logo-default' == $logo_type_mobile ) {
			$custom .= "@media only screen and (max-width: 991px) { .site-logo.light { display: none; } }"."\n";
			$custom .= "@media only screen and (max-width: 991px) { .custom-logo { display: inline-block; } }"."\n";
		} elseif ( 'logo-light' == $logo_after_scroll ) {
			$custom .= "@media only screen and (max-width: 991px) { .site-logo.light { display: inline-block; } }"."\n";
			$custom .= "@media only screen and (max-width: 991px) { .custom-logo { display: none; } }"."\n";
		}
	}

	//__GENERAL
	// Boxed layout and styles
	if ( 'boxed' == $body_layout ) {

		// Add boxed class to body
		function boxed_body_class( $classes ) {
			$classes[] = 'meteorite-boxed';
			return $classes;
		}
		add_filter( 'body_class', 'boxed_body_class' );

		// Body BG image
		$custom .= "body.meteorite-boxed { background-image: url('" . esc_url( $body_image_boxed ) . "'); }"."\n";

		if ( 'image' == $body_boxed_image_type ) {
			$custom .= "body.meteorite-boxed { background-size: cover; background-repeat: no-repeat; background-position: center center; background-attachment: fixed; }"."\n";
		} elseif ( 'pattern' == $body_boxed_image_type ) {
			$custom .= "body.meteorite-boxed { background-repeat: repeat; }"."\n";
		}

	}

	// Page wrapper padding
	if ( 100 != $page_wrapper_padding_top ) {
		$custom .= ".site-content { padding-top:" . intval( $page_wrapper_padding_top ) . "px; }"."\n";
	}
	
	if ( 100 != $page_wrapper_padding_bottom ) {
		$custom .= ".site-content { padding-bottom:" . intval( $page_wrapper_padding_bottom ) . "px; }"."\n";
	}

	// Animation disable
	if ( true == $animation_disable_checkbox ) {
		// Add no-animation class to body
		function no_animations_body_class( $classes ) {
			$classes[] = 'meteorite-no-animations';
			return $classes;
		}
		add_filter( 'body_class', 'no_animations_body_class' );
	}

	if ( true == $hide_meta_single ) {
		$custom .= ".single-post .post-meta { display: none; }"."\n";
	}

	if ( true == $hide_meta_single_projects ) {
		$custom .= ".single-projects .post-meta { display: none; }"."\n";
	}

	// __HEADER AREA

	// Header nav-container background-color
	$custom .= "@media only screen and (min-width: 992px) { .has-header #masthead.above:not(.above-solid) .topbar, .has-header #masthead.above:not(.above-solid) .nav-container { background-color: transparent; } }"."\n";

	// Header image front page
	if ( true == $header_image_full_height_front && is_front_page() ) {
		$custom .= "@media only screen and (min-width: 992px) { .home .header-area, .home .header-image { min-height: 100vh; } }"."\n";
	}
	if ( 800 != $header_height_home && is_front_page() ) {
		$custom .= ".home .header-image { height:" . intval( $header_height_home ) . "px; }"."\n";
	}

	// Header image sub pages
	if ( true == $header_image_full_height_page && ( is_page() || is_single() || is_home() ) ) {
		$custom .= "@media only screen and (min-width: 992px) { .page:not(.home) .header-area, .page:not(.home) .header-image, .single .header-area, .single .header-image, .blog .header-area, .blog .header-image { min-height: 100vh; } }"."\n";
	}
	if ( 800 != $header_height_page && ( is_page() || is_single() || is_home() ) ) {
		$custom .= ".page:not(.home) .header-image, .single .header-image, .blog .header-image { height:" . intval( $header_height_page ) . "px; }"."\n";
	}	

	// Header image overlay front page
	if ( true == $headerimage_overlay_checkbox_front ) {
		$custom .= ".home .header-image .overlay { display: none; }" . "\n";
	}

	// Header image responsiveness
	if ( true == $header_image_responsive ) {
		$custom .= "@media only screen and (max-width: 991px ) { .header-image-small { display: block; } #masthead { position: relative !important; } .parallax-text { position: absolute !important; top: 50% !important; -webkit-transform: translate(-50%, -50%); -ms-transofrorm: translate(-50%, -50%); transform: translate(-50%, -50%); } .header-image:not(.header-slider-item) { height: auto !important; } }"."\n";
	}

	// Header image overlay sub pages
	if ( true == $headerimage_overlay_checkbox_sub ) {
		$custom .= ".page:not(.home) .header-image .overlay, .blog .header-image .overlay, .single-post .header-image .overlay, .single-projects .header-image .overlay { display: none; }" . "\n";
	}

	// Header parallax-text opacity
	if ( true == $headertext_opacity_checkbox ) {
		$custom .= ".parallax-text, .header-button { opacity: 1 !important; }"."\n";
	}

	// Header image fixed background-image
	if ( true == $headerimage_bg_fixed_checkbox ) {
		$custom .= "@media only screen and (min-width: 992px) { .parallax-header { background-attachment: fixed; } }"."\n";
	}

	// Menu position
	if ( 'above' == $menu_position ) {
		$custom .= ".has-header #masthead { position: absolute; top: 0; width: 100%; z-index: 750; }"."\n";
	}

	// Sticky navigation
	if ( 'static' == $sticky_menu ) {
		$custom .= ".nav-container.fixed { position: relative !important;}"."\n";
	}

	// Menu style
	if ( 'centered' == $menu_style ) {
		$custom .= ".nav-container .row { display: block; }"."\n";
		$custom .= ".logo-container { display: block; float: none; padding: 30px 0 0; position: relative; text-align: center; width: 100%; }"."\n";
		$custom .= ".logo-container a img { max-height: 50px; }"."\n";
		$custom .= "#main-nav { float: none; width: 100%; }"."\n";
		$custom .= "#main-nav #primary-menu { float: none; height: auto; text-align: center; width: 100%; }"."\n";
		$custom .= "#main-nav > ul > li > a { padding: 25px 0; }"."\n";
		$custom .= ".navicon { float: none; width: 100%; }"."\n";
		$custom .= ".btn-menu { float: none; height: 60px; margin: 15px auto; padding: 10px 0 10px 0; text-align: center; }"."\n";
		$custom .= ".btn-menu.classic { height: auto; margin: 25px auto; padding: 0; width: auto; }"."\n";
	}

	// Menu width
	if ( 'wide' == $menu_width && 'centered' != $menu_style ) {
		$custom .= ".topbar > .container, .nav-container > .container { padding: 0 25px; width: auto; }"."\n";
	}

	// Menu float
	if ( true == $menu_float ) {
		$custom .= ".nav-container.floated.fixed #main-nav > ul > li > a, .nav-container.floated.fixed #main-nav .search-wrapper i { padding: 20px 0; }"."\n";
		$custom .= ".nav-container.floated.fixed .logo-container a img { max-height: 40px; }"."\n";
		$custom .= ".nav-container.floated .site-description { height: 0; opacity: 0; visibility: hidden; }"."\n";
		if ( 'centered' == $menu_style ) {
			$custom .= ".nav-container.floated.fixed #main-nav > ul > li > a { padding: 10px 0; }"."\n";
			$custom .= ".nav-container.floated.fixed .logo-container { padding: 15px 0 0; }"."\n";
		}
	}

	// __FONTS
	if ( false == $disable_google_fonts ) {	
		if ( '' != $headings_fonts ) {
			$custom .= "input[type='button'], input[type='reset'], input[type='submit'], h1, h2, h3, h4, h5, h6, #main-nav ul li a, .meteorite-projects .project-title, .meteorite-testimonials .name, .meteorite-button, .terra-button, .meteorite-tabs .nav-tabs > li > a, .meteorite-team .team-content .name, .parallax-text .header-image-heading, .site-title, .site-title a { font-family:" . sanitize_text_field( $headings_fonts ) . ";}"."\n";
		}
		if ( '' != $body_fonts ) {
			$custom .= "body { font-family:" . sanitize_text_field( $body_fonts ) . "!important;}"."\n";
		}
	}
	// Site title
	if ( 32 != $site_title_size ) {
		$custom .= ".site-title a { font-size:" . intval( $site_title_size ) . "px; }"."\n";
	}
	// Site description
	if ( 14 != $site_desc_size ) {
		$custom .= ".site-description { font-size:" . intval( $site_desc_size ) . "px; }"."\n";
	}
	// Menu
	if ( 14 != $menu_size ) {
		$custom .= "#main-nav ul li a, .search-wrapper i { font-size:" . intval( $menu_size ) . "px; }"."\n";
	}
	// H1 size
	if ( 44 != $h1_size ) {
		$custom .= "h1 { font-size:" . intval( $h1_size ) . "px; }"."\n";
	}
	// H2 size
	if ( 38 != $h2_size ) {
		$custom .= "h2 { font-size:" . intval( $h2_size ) . "px; }"."\n";
	}
	// H3 size
	if ( 32 != $h3_size ) {
		$custom .= "h3 { font-size:" . intval( $h3_size ) . "px; }"."\n";
	}
	// H4 size
	if ( 28 != $h4_size ) {
		$custom .= "h4 { font-size:" . intval( $h4_size ) . "px; }"."\n";
	}
	// H5 size
	if ( 22 != $h5_size ) {
		$custom .= "h5 { font-size:" . intval( $h5_size ) . "px; }"."\n";
	}
	// H6 size
	if ( 18 != $h6_size ) {
		$custom .= "h6 { font-size:" . intval( $h6_size ) . "px; }"."\n";
	}
	// Body size
	if ( 16 != $body_size ) {
		$custom .= "body { font-size:" . intval( $body_size ) . "px; }"."\n";
	}

	// __COLORS
	// Body text color
	$custom .= "body { color:" . esc_attr( $body_text_color ) . "}"."\n";
	// Primary color
	if ( '#337ab7' != $primary_color ) {
	// color
	$custom .= "a, .about-the-author .byline a:focus, .about-the-author .byline a:hover, .comment-author a:hover, .comment-metadata a:hover, .entry-meta a:hover, #footer-nav li a:hover, i, button:focus, button:hover, input[type='button']:focus, input[type='button']:hover, input[type='reset']:focus, input[type='reset']:hover, input[type='submit']:focus, input[type='submit']:hover, .searchsubmit:focus, .searchsubmit:hover, #main-nav li a:focus, #main-nav li a:hover, .nav-container.fixed #main-nav > ul > li > a:focus, .nav-container.fixed #main-nav > ul > li > a:hover, .nav-container.fixed #main-nav > ul > li > div > a:focus, .nav-container.fixed #main-nav > ul > li > div > a:hover, #mobile-menu li a:focus, #mobile-menu li a:hover, .meteorite-contact-info a:focus, .meteorite-contact-info a:hover, .meteorite-button:focus, .meteorite-button:hover, .meteorite-button.border, .meteorite-pricing-table.style-1:hover .plan-price, .featured-plan .plan-price, .meteorite-pricing-table.style-3 .featured-plan-ribbon::after, .meteorite-post-tabs-widget .news-list li .post-holder a:focus, .meteorite-post-tabs-widget .news-list li .post-holder a:hover, .meteorite-projects-carousel .project-type-excerpt .project-title:focus, .meteorite-projects .project-type-excerpt .project-title:focus, .meteorite-projects-carousel .project-type-excerpt .project-title:hover, .meteorite-projects .project-type-excerpt .project-title:hover, .meteorite-social-media a:focus, .meteorite-social-media a:hover, .meteorite-social-media.border-square li a:focus, .meteorite-social-media.border-rounded li a:focus, .meteorite-social-media.border-round li a:focus, .meteorite-social-media.border-square li a:hover, .meteorite-social-media.border-rounded li a:hover, .meteorite-social-media.border-round li a:hover, .meteorite-tabs-widget .news-list li .post-holder a:hover, .meteorite-team .team-social .social-icons a:focus, .meteorite-team .team-social .social-icons a:hover, .meteorite-team .team-content .name, .meteorite-text-with-icon .icon, .meteorite-text-with-icon .title a:focus, .meteorite-text-with-icon .title a:hover, .meteorite-text-with-icon .type-icon-above.hover-effect:hover .icon.border-none, .meteorite-text-with-icon .type-small-icon-above.hover-effect:hover .icon.border-none, .meteorite-text-with-icon .type-large-icon-above.hover-effect:hover .icon.border-none, .meteorite-text-with-icon .type-icon-left.hover-effect:hover .icon.border-none, .post-meta a:focus, .post-meta a:hover, .project-filter li a:focus, .project-filter li:hover a, .project-filter li a.active, .project-type-excerpt .project-title:hover, .read-more a:hover, #search-fullscreen .overlay-search .overlay-search-close button:hover, #search-fullscreen .overlay-search .overlay-search-close button:focus, .single-meta a:hover, .search-wrapper .search-button:hover i, .upbutton:focus i, .upbutton:hover i, .terra-button:focus, .terra-button:hover, .terra-button.border, .topbar .contact-field span a:focus, .topbar .contact-field span a:hover, .widget-area a:focus, .widget-area a:hover, .woocommerce-info::before { color:" . esc_attr( $primary_color ) . "}"."\n";
	// bg-color
	$custom .= "button, input[type='button'], input[type='reset'], input[type='submit'], .meteorite-button, .meteorite-button.border:focus, .meteorite-button.border:hover, .meteorite-pricing-table.style-2:hover .plan-price, .meteorite-pricing-table.style-2.featured-plan .plan-price, .meteorite-pricing-table.style-3:hover .plan-header, .meteorite-pricing-table.style-3.featured-plan .plan-header, .featured-plan-ribbon, .meteorite-projects-carousel .project-pop::before, .meteorite-projects .project-pop::before, .meteorite-projects-carousel .project-type-reveal-title .project-title-wrap, .meteorite-projects .project-type-reveal-title .project-title-wrap, .meteorite-team .social-icons a, .meteorite-text-with-icon .type-icon-above.hover-effect:hover .icon, .meteorite-text-with-icon .type-small-icon-above.hover-effect:hover .icon, .meteorite-text-with-icon .type-large-icon-above.hover-effect:hover .icon, .meteorite-text-with-icon .type-icon-left.hover-effect:hover .icon, .owl-theme .owl-controls .owl-page span, .posts-navigation .current, #preloader .preloader-type-wave .spinner > div, #preloader .preloader-type-dots .spinner > div, .project-single-nav i:hover, .terra-button, .terra-button.border:focus, .terra-button.border:hover, .seperator::after, .skill-bar-fill, .upbutton { background-color:" . esc_attr( $primary_color ) . "}"."\n";
	// border-color
	$custom .= ".border-square, .border-rounded, .border-round, input[type='search']:focus, button, input[type='button'], input[type='reset'], input[type='submit'], button:focus, input[type='button']:focus, input[type='reset']:focus, input[type='submit']:focus, button:hover, input[type='button']:hover, input[type='reset']:hover, input[type='submit']:hover, input[type='search']:focus, input[type='search']:hover, .meteorite-button, .meteorite-button:focus, .meteorite-button:hover, .meteorite-button.border, .meteorite-button.border:focus, .meteorite-button.border:hover, .posts-navigation .current, .posts-navigation .current, .project-single-nav i:hover, .terra-button, .terra-button:focus, .terra-button:hover, .terra-button.border, .terra-button.border:focus, .terra-button.border:hover, .upbutton:focus, .upbutton:hover { border-color:" . esc_attr( $primary_color ) . "}"."\n";
	// border-top-color
	$custom .= "#main-nav ul ul, #preloader .preloader-type-circles .spinner, #preloader .preloader-type-circles .spinner::before, #preloader .preloader-type-circles .spinner::after, .woocommerce-info { border-top-color:" . esc_attr( $primary_color ) . "}"."\n";
	// fill
	$custom .= ".meteorite-text-with-icon .type-hexagon .svg-container.text-with-icon-svg, .meteorite-text-with-icon .type-hexagon-left .svg-container.text-with-icon-svg { fill: " . esc_attr( $primary_color ) . "}"."\n";
	}
	// Site title
	$custom .= ".site-title a { color:" . esc_attr( $site_title_color ) . "}"."\n";
	// Site description
	$custom .= ".site-description { color:" . esc_attr( $site_desc_color ) . "}"."\n";
	// Site title sticky
	$custom .= "@media only screen and (min-width: 1025px) { .nav-container.fixed .site-title a { color:" . esc_attr( $site_title_color_sticky ) . "} }"."\n";
	// Site description sticky
	$custom .= "@media only screen and (min-width: 1025px) { .nav-container.fixed .site-description { color:" . esc_attr( $site_desc_color_sticky ) . "} }"."\n";
	// Topbar background
	$custom .= ".topbar { background-color:" . esc_attr( $topbar_bg_color ) . "}"."\n";
	// Topbar color
	$custom .= ".topbar .claim-field span, .topbar .contact-field span, .topbar .contact-field span a, .topbar .social-nav ul li a, .topbar .topbar-nav li a { color:" . esc_attr( $topbar_color ) . "}"."\n";
	// Menu background
	$custom .= ".nav-container { background-color:" . esc_attr( $menu_bg_color ) . "}"."\n";
	// Menu sticky background
	$custom .= "@media only screen and (min-width: 1025px) { #masthead .nav-container.fixed { background-color:" . esc_attr( $menu_bg_sticky_color ) . " !important; } }"."\n";
	// Mobile menu background
	$custom .= "#mobile-menu { background-color:" . esc_attr( $mobile_menu_bg_color ) . "}"."\n";
	// Top level menu items color
	$custom .= ".btn-menu.classic i, #main-nav ul li a { color:" . esc_attr( $top_items_color ) . "}"."\n";
	$custom .= ".btn-menu.fancy span, .btn-menu.fancy span::before, .btn-menu.fancy span::after { background-color:" . esc_attr( $top_items_color ) . "}"."\n";
	// Top level menu items color after scroll
	$custom .= ".nav-container.fixed .btn-menu.classic i, .nav-container.fixed #main-nav > ul > li > a, .nav-container.fixed #main-nav > ul > li > div > a { color:" . esc_attr( $top_items_sticky_color ) . "}"."\n";
	$custom .= ".nav-container.fixed .btn-menu.fancy span, .nav-container.fixed .btn-menu.fancy span::before, .nav-container.fixed .btn-menu.fancy span::after { background-color:" . esc_attr( $top_items_sticky_color ) . "}"."\n";
	// Submenu items color
	$custom .= "#main-nav ul ul li a { color:" . esc_attr( $submenu_items_color ) . "}"."\n";
	// Submenu background
	$custom .= "#main-nav .sub-menu { background-color:" . esc_attr( $submenu_background ) . "}"."\n";
	// Mobile menu items color
	$custom .= "#mobile-menu ul li a, .btn-submenu::before { color:" . esc_attr( $mobile_menu_items_color ) . "}"."\n";
	// Header image text color
	$custom .= ".parallax-text .header-image-heading, .parallax-text .header-image-text { color:" . esc_attr( $header_image_text_color ) . "}"."\n";
	// Header titlebar background
	$custom .= ".titlebar { background-color:" . esc_attr( $header_titlebar_background ) . "}"."\n";
	// Header titlebar color
	$custom .= ".titlebar { color:" . esc_attr( $header_titlebar_color ) . "}"."\n";
	// Footer widgets background
	$custom .= ".footer-widgets { background-color:" . esc_attr( $footer_widgets_background ) . "}"."\n";
	// Footer widgets color
	$custom .= ".footer-widgets, .footer-widgets a, .footer-widgets caption, .footer-widgets .widget-title, .footer-widgets .widget_recent_entries ul li::before, .footer-widgets .widget_recent_comments ul li::before, .footer-widgets .widget_archive ul li::before, .footer-widgets .widget_categories ul li::before, .footer-widgets .widget_meta ul li::before, .footer-widgets .widget_pages ul li::before, .footer-widgets .widget_nav_menu div ul li::before, .footer-widgets .widget_product_categories ul li::before { color:" . esc_attr( $footer_widgets_color ) . "}"."\n";
	// Footer background
	$custom .= ".site-footer { background-color:" . esc_attr( $footer_background ) . "}"."\n";
	// Footer color
	$custom .= ".site-footer, .site-footer a { color:" . esc_attr( $footer_color ) . "}"."\n";
	// Overlay color
	$custom .= ".header-image .overlay { background-color:" . esc_attr( $header_overlay_color ) . "}"."\n";

	// Footer BG image
	if ( '' != $footer_bg_image ) {
		$custom .= ".footer-area { background: url('" . esc_url( $footer_bg_image ) . "') no-repeat center; background-size: cover; }"."\n";

		// Footer widgets background
		$rgba_footer_widgets_background = meteorite_hex2rgba( $footer_widgets_background, 0.9 );
		$custom .= ".footer-widgets { background-color:" . esc_attr( $rgba_footer_widgets_background ) . "}"."\n";

		// Footer background
		$rgba_footer_background = meteorite_hex2rgba( $footer_background, 0.9 );
		$custom .= ".site-footer { background-color:" . esc_attr( $rgba_footer_background ) . "}"."\n";
	}

	// Footer Alignment
	if ( true == $footer_text_center ) {
		$custom .= "#colophon .col-md-6 { float: none; margin-bottom: 10px; margin-top: 10px; text-align: center; width: 100%; }"."\n";
		$custom .= "#colophon #footer-nav { float: none; }"."\n";
		$custom .= "#colophon .privacy-link { display: block; float: none; padding: 10px 20px; text-align: center; }"."\n";
	}

	// meteorite_hex2rgba

	// Topbar borders
	$rgba_topbar_border_color = meteorite_hex2rgba( $topbar_border_color, 0.1 );
	$custom .= ".nav-container, #mobile-menu, .topbar, .topbar .topbar-nav li a, .topbar .topbar-nav-left ul li a, #main-nav .mega-menu > ul > li > a { border-color:" . esc_attr( $rgba_topbar_border_color ) . "}"."\n";

	// text-with-icon-icon hover effect
	$rgba_icon_with_text = meteorite_hex2rgba( $primary_color, 0.5 );
	$custom .= ".meteorite-text-with-icon .type-icon-above.hover-effect:hover .icon, .meteorite-text-with-icon .type-small-icon-above.hover-effect:hover .icon, .meteorite-text-with-icon .type-large-icon-above.hover-effect:hover .icon, .meteorite-text-with-icon .type-icon-left.hover-effect:hover .icon { box-shadow: 0 0 0 5px " . esc_attr( $rgba_icon_with_text ) . ";}" . "\n";


	// WooCommerce Shop
	if ( class_exists( 'WooCommerce' ) ) {
		if ( true == $shop_full_width ) {
			$custom .= ".woocommerce.woocommerce-page aside.widget-area { display: none; }"."\n";
			$custom .= ".woocommerce.woocommerce-page .content-area { float: none; width: 100%; }"."\n";
		}
		if ( '#337ab7' != $primary_color ) {
		$custom .= ".woocommerce ul.products li.product .price, .woocommerce #respond input#submit:focus, .woocommerce a.button:focus, .woocommerce button.button:focus, .woocommerce input.button:focus, .woocommerce #respond input#submit:hover, .woocommerce a.button:hover, .woocommerce button.button:hover, .woocommerce input.button:hover, .woocommerce div.product p.price, .woocommerce div.product span.price, .woocommerce #respond input#submit.alt:focus, .woocommerce a.button.alt:focus, .woocommerce button.button.alt:focus, .woocommerce input.button.alt:focus, .woocommerce #respond input#submit.alt:hover, .woocommerce a.button.alt:hover, .woocommerce button.button.alt:hover, .woocommerce input.button.alt:hover, .woocommerce-message:before, .product-item a:hover .product-item-name h4 { color:" . esc_attr( $primary_color ) . "}"."\n";
		$custom .= ".woocommerce span.onsale, .woocommerce ul.products li.product .onsale, .woocommerce #respond input#submit.alt, .woocommerce a.button.alt, .woocommerce button.button.alt, .woocommerce input.button.alt, .woocommerce #respond input#submit.disabled, .woocommerce #respond input#submit.disabled:hover, .woocommerce #respond input#submit:disabled, .woocommerce #respond input#submit:disabled:hover, .woocommerce #respond input#submit[disabled]:disabled, .woocommerce #respond input#submit[disabled]:disabled:hover, .woocommerce a.button.disabled, .woocommerce a.button.disabled:hover, .woocommerce a.button:disabled, .woocommerce a.button:disabled:hover, .woocommerce a.button[disabled]:disabled, .woocommerce a.button[disabled]:disabled:hover, .woocommerce button.button.disabled, .woocommerce button.button.disabled:hover, .woocommerce button.button:disabled, .woocommerce button.button:disabled:hover, .woocommerce button.button[disabled]:disabled, .woocommerce button.button[disabled]:disabled:hover, .woocommerce input.button.disabled, .woocommerce input.button.disabled:hover, .woocommerce input.button:disabled, .woocommerce input.button:disabled:hover, .woocommerce input.button[disabled]:disabled, .woocommerce input.button[disabled]:disabled:hover, .woocommerce #respond input#submit.alt.disabled, .woocommerce #respond input#submit.alt.disabled:hover, .woocommerce #respond input#submit.alt:disabled, .woocommerce #respond input#submit.alt:disabled:hover, .woocommerce #respond input#submit.alt[disabled]:disabled, .woocommerce #respond input#submit.alt[disabled]:disabled:hover, .woocommerce a.button.alt.disabled, .woocommerce a.button.alt.disabled:hover, .woocommerce a.button.alt:disabled, .woocommerce a.button.alt:disabled:hover, woocommerce a.button.alt[disabled]:disabled, .woocommerce a.button.alt[disabled]:disabled:hover, .woocommerce button.button.alt.disabled, .woocommerce button.button.alt.disabled:hover, .woocommerce button.button.alt:disabled, .woocommerce button.button.alt:disabled:hover, .woocommerce button.button.alt[disabled]:disabled, .woocommerce button.button.alt[disabled]:disabled:hover, .woocommerce input.button.alt.disabled, .woocommerce input.button.alt.disabled:hover, .woocommerce input.button.alt:disabled, .woocommerce input.button.alt:disabled:hover, .woocommerce input.button.alt[disabled]:disabled, .woocommerce input.button.alt[disabled]:disabled:hover, .woocommerce .widget_price_filter .ui-slider .ui-slider-handle, .woocommerce .widget_price_filter .ui-slider .ui-slider-range, .woocommerce-cart .wc-proceed-to-checkout a.checkout-button, .woocommerce #respond input#submit, .woocommerce a.button, .woocommerce button.button, .woocommerce input.button, .woocommerce input.button.alt { background-color:" . esc_attr( $primary_color ) . "}"."\n";
		$custom .= ".woocommerce-cart .wc-proceed-to-checkout a.checkout-button, .woocommerce #respond input#submit, .woocommerce a.button, .woocommerce button.button, .woocommerce input.button, .woocommerce input.button.alt, .woocommerce-message { border-color:" . esc_attr( $primary_color ) . "}"."\n";
		}
	}

	// Output all the styles
	wp_add_inline_style( 'meteorite-style', $custom );
}
add_action( 'wp_enqueue_scripts', 'meteorite_custom_styles' );